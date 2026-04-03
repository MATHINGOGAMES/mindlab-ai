"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../core/sounds";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

const SHAPES = [
  {
    id: 1,
    icon: "▲",
    color: "bg-blue-600",
    glow: "shadow-[0_0_35px_rgba(37,99,235,0.6)]",
    label: "Delta",
  },
  {
    id: 2,
    icon: "■",
    color: "bg-red-600",
    glow: "shadow-[0_0_35px_rgba(220,38,38,0.6)]",
    label: "Sigma",
  },
  {
    id: 3,
    icon: "●",
    color: "bg-green-600",
    glow: "shadow-[0_0_35px_rgba(22,163,74,0.6)]",
    label: "Omega",
  },
  {
    id: 4,
    icon: "◆",
    color: "bg-yellow-600",
    glow: "shadow-[0_0_35px_rgba(202,138,4,0.6)]",
    label: "Alpha",
  },
  {
    id: 5,
    icon: "⬢",
    color: "bg-purple-600",
    glow: "shadow-[0_0_35px_rgba(147,51,234,0.6)]",
    label: "Zeta",
  },
  {
    id: 6,
    icon: "★",
    color: "bg-pink-600",
    glow: "shadow-[0_0_35px_rgba(219,39,119,0.6)]",
    label: "Nova",
  },
];

export default function GeometryMemory() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeShape, setActiveShape] = useState(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("win");
  const [shake, setShake] = useState(false);

  const getSpeed = useCallback(() => Math.max(160, 750 - level * 65), [level]);

  const startNextLevel = useCallback(
    async (currentSeq) => {
      setIsDisplaying(true);
      setUserSequence([]);
      const nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const newSequence = [...currentSeq, nextShape];
      setSequence(newSequence);

      await new Promise((r) => setTimeout(r, 900));

      for (const shape of newSequence) {
        setActiveShape(shape.id);
        playSound("correct");
        await new Promise((r) => setTimeout(r, getSpeed()));
        setActiveShape(null);
        await new Promise((r) => setTimeout(r, getSpeed() / 2));
      }
      setIsDisplaying(false);
    },
    [getSpeed]
  );

  // --- دالة إعادة الضبط (The Missing Function) ---
  const resetGame = useCallback(() => {
    setIsModalOpen(false);
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
    setScore(0);
    setTimeout(() => startNextLevel([]), 500);
  }, [startNextLevel]);

  const handleShapeClick = (shape) => {
    if (isDisplaying || isModalOpen) return;
    setActiveShape(shape.id);
    setTimeout(() => setActiveShape(null), 120);

    const currentIndex = userSequence.length;
    if (shape.id !== sequence[currentIndex].id) {
      playSound("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setStatus("lose");
      setIsModalOpen(true);
      return;
    }

    playSound("correct");
    const newUserSequence = [...userSequence, shape];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      setScore((s) => s + (level >= 8 ? level * 40 : level * 25));
      setTimeout(() => {
        setLevel((l) => l + 1);
        startNextLevel(sequence);
      }, 700);
    }
  };

  useEffect(() => {
    startNextLevel([]);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#020202] text-white flex flex-col items-center p-8 transition-all duration-300 overflow-hidden font-sans ${
        shake ? "bg-red-950/20" : ""
      }`}
    >
      <Helmet>
        <title>GEOMETRY_SYNC | NEURAL RECONSTRUCTION</title>
      </Helmet>

      {/* 📡 Top UI Bar */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl flex justify-between items-center mb-10 bg-zinc-950/50 p-6 rounded-full border border-white/5 backdrop-blur-xl"
      >
        <div className="font-mono">
          <p className="text-cyan-500 text-[10px] tracking-[0.4em] font-black uppercase">
            System Link
          </p>
          <h1 className="text-2xl font-black tracking-tighter italic text-white">
            GEOMETRY_SYNC
          </h1>
        </div>
        <div className="flex gap-8">
          <Stat label="NODE" value={level} color="text-white" />
          <Stat label="BIT_SCORE" value={score} color="text-cyan-400" />
        </div>
      </motion.div>

      {/* 🛡️ Mission Briefing (The Heroes Message) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 p-4 border-l-2 border-cyan-500 bg-cyan-500/5 max-w-md w-full"
      >
        <p className="text-[10px] font-mono text-cyan-400 leading-relaxed uppercase tracking-tighter">
          {">"} INCOMING MISSION: The Geometry Beast is active. <br />
          {">"} SYNC your brain. REACH the highest NODE. <br />
          {">"} Prove your mental supremacy. GOOD LUCK, HEROES.
        </p>
      </motion.div>

      {/* 🔮 Neural Grid */}
      <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-md w-full mb-16">
        {SHAPES.map((shape) => (
          <motion.button
            key={shape.id}
            whileHover={!isDisplaying ? { scale: 1.03 } : {}}
            whileTap={!isDisplaying ? { scale: 0.95 } : {}}
            onClick={() => handleShapeClick(shape)}
            className={`relative h-28 sm:h-36 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-200 border-2 ${
              activeShape === shape.id
                ? `${shape.color} ${shape.glow} border-white scale-105 z-10`
                : "bg-zinc-900/40 border-white/10 text-zinc-800"
            }`}
          >
            <span
              className={`text-5xl mb-2 ${
                activeShape === shape.id ? "text-white" : ""
              }`}
            >
              {shape.icon}
            </span>
            <span className="text-[9px] font-black opacity-40 uppercase tracking-widest font-mono">
              {shape.label}
            </span>
            {activeShape === shape.id && (
              <motion.div
                layoutId="pulse"
                className="absolute inset-0 rounded-[2.5rem] border-4 border-white/40 animate-pulse"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* 📡 Terminal Status */}
      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${
              isDisplaying
                ? "bg-yellow-500 animate-pulse"
                : "bg-cyan-500 animate-ping"
            }`}
          />
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-50">
            {isDisplaying ? "Analyzing Pattern..." : "Awaiting user input"}
          </p>
        </div>
      </div>

      {/* --- ENGLISH UPGRADE PANEL --- */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 p-10 bg-zinc-950/70 rounded-[3rem] border border-white/5">
        <section className="font-mono">
          <h3 className="text-cyan-400 font-black text-xs tracking-[0.3em] mb-4 uppercase flex items-center gap-2">
            COGNITIVE UPGRADE
          </h3>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Neural pathways are re-calibrated to store high-speed visual data
            for rapid recall and mental acuity.
          </p>
        </section>
        <section className="font-mono">
          <h3 className="text-purple-400 font-black text-xs tracking-[0.3em] mb-4 uppercase flex items-center gap-2">
            SENSORY SYNERGY
          </h3>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Hand-eye coordination is optimized to execute rapid responses. Brain
            learns to link sounds to abstract symbols.
          </p>
        </section>
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={isModalOpen}
        status={status}
        score={score}
        time={`Node ${level}`}
        onRestart={resetGame}
      />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="text-right">
      <p className="text-[8px] font-black text-zinc-600 tracking-[0.3em] uppercase mb-1 font-mono">
        {label}
      </p>
      <p className={`text-2xl font-mono font-black ${color}`}>{value}</p>
    </div>
  );
}
