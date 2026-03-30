"use client";

// تأكد من استيراد useRef و AnimatePresence بدقة هنا
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../core/sounds";
import { generateAIGrid } from "../../ai/aiGridGenerator";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

const WORLDS = {
  PRIMARY: {
    name: "NEON ALPHABET",
    color: "text-cyan-400",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.4)]",
    border: "border-cyan-500/30",
  },
  MIDDLE: {
    name: "LOGIC VORTEX",
    color: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(192,132,252,0.4)]",
    border: "border-purple-500/30",
  },
  SECONDARY: {
    name: "QUANTUM CORE",
    color: "text-orange-400",
    glow: "shadow-[0_0_20px_rgba(251,146,60,0.4)]",
    border: "border-orange-500/30",
  },
};

export default function MemoryAI() {
  const [stage, setStage] = useState("PRIMARY");
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [status, setStatus] = useState("loading");
  const [score, setScore] = useState(1000);
  const [energy, setEnergy] = useState(100);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isTimeFrozen, setIsTimeFrozen] = useState(false);
  const [powers, setPowers] = useState({ freeze: 2, scan: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // استخدام useRef للتحكم في التوقيت بدقة
  const timerRef = useRef(null);

  const loadGame = useCallback(async () => {
    setStatus("loading");
    setEnergy(100);
    // تأكد من توليد عدد زوجي من البطاقات
    const pairCount = Math.min(3 + Math.floor(level / 2), 10);
    try {
      const data = await generateAIGrid(level, pairCount, "PAIRS", stage);
      if (data && data.cards) {
        setCards(data.cards);
        setFlipped([]);
        setSolved([]);
        setStatus("playing");
      }
    } catch (error) {
      console.error("AI Grid Error:", error);
    }
  }, [level, stage]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  // تفعيل محرك الوقت باستخدام useRef
  useEffect(() => {
    if (status === "playing" && energy > 0 && !isTimeFrozen) {
      timerRef.current = setInterval(() => {
        setEnergy((prev) => Math.max(0, prev - (0.3 + level * 0.1)));
      }, 100);
    }

    if (energy <= 0 && status === "playing") {
      clearInterval(timerRef.current);
      setStatus("lost");
      setIsModalOpen(true);
    }

    return () => clearInterval(timerRef.current);
  }, [status, energy, isTimeFrozen, level]);

  const handleCardClick = (idx) => {
    if (status !== "playing" || flipped.includes(idx) || solved.includes(idx))
      return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setStatus("checking");
      const [first, second] = newFlipped;

      if (cards[first].matchId === cards[second].matchId) {
        playSound("correct");
        setSolved((prev) => [...prev, first, second]);
        setScore((s) => s + 200);
        setEnergy((prev) => Math.min(100, prev + 10));
        setFlipped([]);
        setStatus("playing");
      } else {
        playSound("wrong");
        setTimeout(() => {
          setFlipped([]);
          setStatus("playing");
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (
      cards.length > 0 &&
      solved.length === cards.length &&
      status !== "loading"
    ) {
      clearInterval(timerRef.current);
      playSound("win");
      setIsModalOpen(true);
    }
  }, [solved, cards, status]);

  // القدرات الخارقة
  const useScan = () => {
    if (powers.scan > 0 && status === "playing") {
      setPowers((p) => ({ ...p, scan: p.scan - 1 }));
      const currentFlipped = [...flipped];
      setFlipped(cards.map((_, i) => i));
      setTimeout(() => setFlipped(currentFlipped), 1000);
    }
  };

  const useFreeze = () => {
    if (powers.freeze > 0 && !isTimeFrozen) {
      setPowers((p) => ({ ...p, freeze: p.freeze - 1 }));
      setIsTimeFrozen(true);
      setTimeout(() => setIsTimeFrozen(false), 5000);
    }
  };

  if (isShopOpen)
    return (
      <ShopView
        score={score}
        setScore={setScore}
        setPowers={setPowers}
        close={() => setIsShopOpen(false)}
      />
    );

  const currentTheme = WORLDS[stage];

  return (
    <div
      className={`min-h-screen bg-[#020202] text-white p-6 flex flex-col items-center font-black ${
        isTimeFrozen ? "shadow-[inset_0_0_100px_rgba(0,255,255,0.15)]" : ""
      }`}
    >
      <Helmet>
        <title>NEURAL SYNC | {currentTheme.name}</title>
      </Helmet>

      {/* Header HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 bg-zinc-900/40 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
        <div className="px-4">
          <div className="text-[8px] text-zinc-500 tracking-widest mb-1">
            CORE ENERGY
          </div>
          <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${energy}%` }}
              className={`h-full ${
                isTimeFrozen ? "bg-cyan-400" : "bg-red-500"
              }`}
            />
          </div>
        </div>
        <button
          onClick={() => setIsShopOpen(true)}
          className="text-amber-400 bg-amber-500/10 px-6 py-2 rounded-2xl border border-amber-500/20 hover:bg-amber-500/20 transition-all font-mono"
        >
          {score} XP 🛒
        </button>
      </div>

      {/* المصفوفة - تظهر فقط عند انتهاء التحميل */}
      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {status === "loading" ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-zinc-700 tracking-[0.5em] text-[10px]"
            >
              INITIALIZING GRID...
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`grid gap-4 ${
                cards.length > 12
                  ? "grid-cols-4 sm:grid-cols-6"
                  : "grid-cols-3 sm:grid-cols-4"
              }`}
            >
              {cards.map((card, idx) => (
                <Card
                  key={card.id || idx}
                  content={card.content}
                  isFlipped={flipped.includes(idx) || solved.includes(idx)}
                  isSolved={solved.includes(idx)}
                  onClick={() => handleCardClick(idx)}
                  theme={currentTheme}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Power-ups */}
      <div className="flex gap-8 mt-10">
        <PowerButton
          icon="🧊"
          count={powers.freeze}
          active={isTimeFrozen}
          onClick={useFreeze}
          color="border-cyan-500"
        />
        <PowerButton
          icon="📡"
          count={powers.scan}
          onClick={useScan}
          color="border-purple-500"
        />
      </div>

      <ResultModal
        isOpen={isModalOpen}
        status={energy > 0 ? "win" : "lose"}
        score={score}
        onRestart={() => {
          setIsModalOpen(false);
          loadGame();
        }}
        nextLevel={() => {
          setLevel((l) => l + 1);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

// مكون البطاقة (Card)
function Card({ content, isFlipped, isSolved, onClick, theme }) {
  return (
    <div
      onClick={onClick}
      className="relative w-20 h-28 sm:w-24 sm:h-32 cursor-pointer transition-transform hover:scale-105 active:scale-95"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* الخلف */}
        <div
          className={`absolute inset-0 bg-[#0a0a0a] rounded-2xl border ${theme.border} ${theme.glow} flex items-center justify-center`}
        >
          <span className="text-2xl opacity-10">🧠</span>
        </div>
        {/* الوجه */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-2xl font-black text-3xl ${
            isSolved
              ? "bg-white text-black"
              : `bg-zinc-900 border-2 ${theme.border} ${theme.color}`
          }`}
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          {content}
        </div>
      </motion.div>
    </div>
  );
}

function PowerButton({ icon, count, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-14 h-14 rounded-2xl border-2 bg-zinc-900 flex items-center justify-center text-xl transition-all ${color} ${
        active ? "animate-pulse scale-110 shadow-lg" : "opacity-60"
      } ${count === 0 ? "grayscale opacity-20" : ""}`}
    >
      {icon}
      <span className="absolute -top-2 -right-2 bg-white text-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-black font-bold">
        {count}
      </span>
    </button>
  );
}

function ShopView({ score, setScore, setPowers, close }) {
  const buy = (type, price) => {
    if (score >= price) {
      setScore((s) => s - price);
      setPowers((p) => ({ ...p, [type]: p[type] + 1 }));
      playSound("correct");
    }
  };
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center p-8">
      <h2 className="text-amber-500 tracking-[0.5em] mb-12 text-xs font-black uppercase">
        Neural Shop
      </h2>
      <div className="grid gap-4 w-full max-w-sm">
        <button
          onClick={() => buy("freeze", 500)}
          className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 flex justify-between items-center hover:border-cyan-500/40 transition-all"
        >
          <div className="text-left font-black text-cyan-400 text-xs">
            FREEZE 🧊
          </div>
          <div className="text-amber-400 text-xs">500 XP</div>
        </button>
        <button
          onClick={() => buy("scan", 800)}
          className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 flex justify-between items-center hover:border-purple-500/40 transition-all"
        >
          <div className="text-left font-black text-purple-400 text-xs">
            SCAN 📡
          </div>
          <div className="text-amber-400 text-xs">800 XP</div>
        </button>
      </div>
      <button
        onClick={close}
        className="mt-16 text-zinc-600 text-[10px] tracking-widest hover:text-white uppercase"
      >
        Back to Mission
      </button>
    </div>
  );
}
