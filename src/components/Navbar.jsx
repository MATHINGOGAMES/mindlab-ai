"use client";

import { useGameStore } from "@/core/store";
import { getRank } from "@/core/ranks"; // استيراد منطق الرتب الذي برمجناه
import { motion } from "framer-motion";

export default function Navbar() {
  const { xp } = useGameStore();

  // الحصول على الرتبة الحالية بناءً على الـ XP الإجمالي
  const currentRank = getRank(xp);

  // لنفترض أن كل مستوى يتطلب 500 XP للتبسيط في شريط التقدم العلوي
  const progressToNextLevel = ((xp % 500) / 500) * 100;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[50] bg-black/50 backdrop-blur-xl border-b border-white/5 px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-black font-black text-xl">M</span>
          </div>
          <h2 className="text-lg font-black tracking-tighter text-white hidden sm:block">
            MINDLAB <span className="text-blue-500">AI</span>
          </h2>
        </div>

        {/* Player Stats Section */}
        <div className="flex items-center gap-6">
          {/* Rank Info */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">
              Current Rank
            </span>
            <span
              className={`text-sm font-bold ${currentRank.color} flex items-center gap-1`}
            >
              {currentRank.icon} {currentRank.name}
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex justify-between w-32 sm:w-48 mb-1">
              <span className="text-[10px] font-mono text-zinc-400">
                {xp} XP
              </span>
              <span className="text-[10px] font-mono text-blue-400">
                LVL {Math.floor(xp / 500) + 1}
              </span>
            </div>

            <div className="w-32 sm:w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              />
            </div>
          </div>

          {/* User Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-xl grayscale hover:grayscale-0 transition-all cursor-pointer">
            👤
          </div>
        </div>
      </div>
    </nav>
  );
}
