// src/components/shared/ResultModal.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { playSound } from "@/core/sounds";
import { useGameStore } from "@/core/store"; // لنحصل على الـ XP الإجمالي
import { getRank, getNextRank } from "@/core/ranks";

export default function ResultModal({
  isOpen,
  status,
  score,
  time,
  onRestart,
  nextLevel,
}) {
  const totalXP = useGameStore((state) => state.xp); // نفترض أن مخزنك يحتوي على xp
  const currentRank = getRank(totalXP);
  const nextRank = getNextRank(totalXP);

  // حساب نسبة التقدم للرتبة التالية
  const progress = nextRank
    ? ((totalXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) *
      100
    : 100;

  useEffect(() => {
    if (isOpen) {
      status === "win" ? playSound("win") : playSound("wrong");
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <span className="text-5xl mb-4">
              {status === "win" ? "🏆" : "💀"}
            </span>

            <h2
              className={`text-2xl font-black mb-6 ${
                status === "win" ? "text-green-400" : "text-red-500"
              }`}
            >
              {status === "win" ? "SYSTEM CALIBRATED" : "NEURAL BREACH"}
            </h2>

            {/* قسم الرتبة (Ranking Section) */}
            <div className="w-full bg-white/5 rounded-2xl p-4 mb-6 border border-white/5">
              <div className="flex justify-between items-end mb-2">
                <div className="text-left">
                  <p className="text-[8px] font-black text-zinc-500 tracking-[0.2em] uppercase">
                    Current Rank
                  </p>
                  <p className={`text-sm font-black ${currentRank.color}`}>
                    {currentRank.icon} {currentRank.name}
                  </p>
                </div>
                <p className="text-[10px] font-mono text-zinc-400">
                  {totalXP} XP
                </p>
              </div>

              {/* شريط التقدم */}
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full transition-all ${currentRank.color.replace(
                    "text",
                    "bg"
                  )}`}
                />
              </div>
              {nextRank && (
                <p className="text-[8px] text-zinc-500 mt-2 text-right uppercase tracking-widest">
                  {nextRank.minXP - totalXP} XP to {nextRank.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-zinc-800/50 p-3 rounded-xl">
                <p className="text-[8px] text-zinc-500 uppercase">Points</p>
                <p className="text-xl font-black">+{score}</p>
              </div>
              <div className="bg-zinc-800/50 p-3 rounded-xl">
                <p className="text-[8px] text-zinc-500 uppercase">Time</p>
                <p className="text-xl font-black">{time}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={nextLevel}
                className="w-full py-4 bg-white text-black font-black rounded-2xl"
              >
                CONTINUE
              </button>
              <button
                onClick={onRestart}
                className="w-full py-3 text-zinc-500 text-xs font-bold uppercase tracking-widest"
              >
                Restart Session
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
