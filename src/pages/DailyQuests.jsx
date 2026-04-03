"use client";
import { motion } from "framer-motion";
import { useGameStore } from "../core/store";

export default function DailyQuests() {
  const { dailyQuests, claimReward } = useGameStore();

  // حماية في حال لم يكن الـ store جاهزاً بعد
  if (!dailyQuests) return null;

  const { wordCatcherDone, neuralGridDone, claimed } = dailyQuests;
  const allCompleted = wordCatcherDone && neuralGridDone;

  return (
    <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl font-mono">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-cyan-500 text-xs font-black tracking-[0.4em] uppercase">
            Daily Objectives
          </h2>
          <p className="text-zinc-600 text-[10px] mt-1 uppercase italic">
            Sync status: {allCompleted ? "Ready" : "Pending"}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          <span className="text-amber-500 text-[10px] font-black">+500 XP</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Quest Item 01 */}
        <div
          className={`p-4 rounded-2xl border transition-all duration-500 ${
            wordCatcherDone
              ? "bg-cyan-500/5 border-cyan-500/20"
              : "bg-black/40 border-white/5 opacity-40"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-500">#WC_01</span>
            {wordCatcherDone && (
              <span className="text-cyan-400 text-xs">COMPLETED</span>
            )}
          </div>
          <h3 className="text-white text-sm font-black mt-1">WORD HUNTER</h3>
        </div>

        {/* Quest Item 02 */}
        <div
          className={`p-4 rounded-2xl border transition-all duration-500 ${
            neuralGridDone
              ? "bg-cyan-500/5 border-cyan-500/20"
              : "bg-black/40 border-white/5 opacity-40"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-500">#NG_02</span>
            {neuralGridDone && (
              <span className="text-cyan-400 text-xs">COMPLETED</span>
            )}
          </div>
          <h3 className="text-white text-sm font-black mt-1">NEURAL GRID</h3>
        </div>
      </div>

      <motion.button
        disabled={!allCompleted || claimed}
        onClick={claimReward}
        whileTap={{ scale: 0.98 }}
        className={`w-full mt-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all ${
          claimed
            ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-default"
            : allCompleted
            ? "bg-cyan-600 text-black shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:bg-cyan-400"
            : "bg-zinc-900 text-zinc-700 border border-white/5 cursor-not-allowed"
        }`}
      >
        {claimed
          ? "REWARD_COLLECTED"
          : allCompleted
          ? "INITIALIZE_REWARD_CLAIM"
          : "LOCKED_UNTIL_SYNC"}
      </motion.button>
    </div>
  );
}
