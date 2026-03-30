"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../core/sounds";
import { useGameEngine } from "../../core/game-engine";
import ResultModal from "../../components/shared/ResultModal";

// تعريف العوالم لزيادة الحماس
const WORLDS = [
  { name: "NEON JUNGLE", color: "from-green-500", bg: "bg-green-950/10" },
  { name: "CYBER CITY", color: "from-blue-500", bg: "bg-blue-950/10" },
  { name: "SILICON VALLEY", color: "from-purple-500", bg: "bg-purple-950/10" },
  { name: "CORE SERVER", color: "from-red-500", bg: "bg-red-950/10" },
];

export default function NeonMathAdvancedPro() {
  const { question, timeLeft, answer, profile } = useGameEngine();

  const [currentWorldIdx, setCurrentWorldIdx] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [isBossLevel, setIsBossLevel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // منطق تتبع التقدم والخرائط
  useEffect(() => {
    const progress = profile.streak % 10;

    // التنبيه بمستوى الزعيم
    if (progress === 9) {
      setIsBossLevel(true);
    } else {
      setIsBossLevel(false);
    }

    // عند إكمال 10 أسئلة، أظهر الخريطة وانتقل للعالم التالي
    if (profile.streak > 0 && profile.streak % 10 === 0 && !showMap) {
      setShowMap(true);
      setTimeout(() => {
        setShowMap(false);
        setCurrentWorldIdx((prev) => (prev + 1) % WORLDS.length);
      }, 3000); // تظهر الخريطة لمدة 3 ثوانٍ
    }
  }, [profile.streak]);

  const handleChoice = (opt) => {
    if (opt === question.answer) {
      playSound("correct");
    } else {
      playSound("wrong");
      setIsModalOpen(true);
    }
    answer(opt);
  };

  const currentWorld = WORLDS[currentWorldIdx];

  // --- شاشة الخريطة (World Map Screen) ---
  if (showMap) {
    return (
      <div className="h-screen bg-[#020202] flex flex-col items-center justify-center p-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-zinc-500 font-black tracking-[0.5em] mb-8">
            SECTOR CLEARED!
          </h2>
          <div className="flex gap-4 mb-12">
            {WORLDS.map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full border-2 ${
                    i <= currentWorldIdx
                      ? "border-cyan-400 bg-cyan-400/20"
                      : "border-zinc-800 bg-zinc-900"
                  } flex items-center justify-center`}
                >
                  {i < currentWorldIdx
                    ? "✅"
                    : i === currentWorldIdx
                    ? "🚀"
                    : i + 1}
                </div>
                <div
                  className={`h-1 w-8 ${
                    i < WORLDS.length - 1 ? "bg-zinc-800" : "hidden"
                  }`}
                />
              </div>
            ))}
          </div>
          <h1
            className={`text-5xl font-black italic bg-gradient-to-r ${
              WORLDS[(currentWorldIdx + 1) % WORLDS.length].color
            } to-white bg-clip-text text-transparent animate-pulse`}
          >
            NEXT: {WORLDS[(currentWorldIdx + 1) % WORLDS.length].name}
          </h1>
        </motion.div>
      </div>
    );
  }

  // --- واجهة اللعب الأساسية ---
  return (
    <div
      className={`min-h-screen transition-all duration-1000 flex flex-col items-center justify-center p-6 ${
        isBossLevel ? "bg-red-950/30" : currentWorld.bg
      }`}
    >
      {/* HUD & Sector Info */}
      <div className="w-full max-w-md mb-6 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">
            World
          </span>
          <span
            className={`text-lg font-black italic ${currentWorld.color.replace(
              "from-",
              "text-"
            )}`}
          >
            {currentWorld.name}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">
            Progress
          </span>
          <div className="text-xl font-black text-white">
            {profile.streak % 10}/10
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full max-w-md h-1 bg-zinc-900 rounded-full mb-12 overflow-hidden border border-white/5">
        <motion.div
          animate={{ width: `${((profile.streak % 10) / 10) * 100}%` }}
          className={`h-full ${
            isBossLevel
              ? "bg-red-500 shadow-[0_0_15px_red]"
              : "bg-cyan-400 shadow-[0_0_10px_cyan]"
          }`}
        />
      </div>

      {/* Question Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question?.question}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-8xl font-black mb-16 tracking-tighter text-center ${
            isBossLevel
              ? "text-red-500 drop-shadow-[0_0_20px_red]"
              : "text-white"
          }`}
        >
          {isBossLevel && (
            <div className="text-xs tracking-[1em] mb-4 animate-bounce">
              BOSS BATTLE
            </div>
          )}
          {question?.question}
        </motion.div>
      </AnimatePresence>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {question?.options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleChoice(opt)}
            className={`h-28 rounded-3xl text-4xl font-black border-2 transition-all ${
              isBossLevel
                ? "bg-red-500/10 border-red-500/30 hover:border-red-500"
                : "bg-zinc-900/40 border-white/5 hover:border-cyan-500/50"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {/* Stats Bottom Bar */}
      <div className="mt-12 flex gap-8">
        <StatItem label="LEVEL" value={profile.level} />
        <StatItem label="TOTAL XP" value={profile.xp} />
        <StatItem label="COMBO" value={`x${profile.streak}`} />
      </div>

      <ResultModal
        isOpen={isModalOpen}
        status="lose"
        score={profile.xp}
        onRestart={() => window.location.reload()}
      />
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] font-bold text-zinc-600 tracking-widest">
        {label}
      </span>
      <span className="text-lg font-black text-zinc-300">{value}</span>
    </div>
  );
}
