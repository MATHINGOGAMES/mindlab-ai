// src/components/Dashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useGameStore } from "../core/store";

// 🎴 مكون البطاقة الموحد للألعاب
const GameCard = ({ title, path, icon, desc, color }) => (
  <Link to={path}>
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-[#0f0f0f] border border-white/10 p-6 rounded-3xl group relative overflow-hidden h-full flex flex-col"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
        {title}
      </h3>
      <p className="text-zinc-500 text-xs leading-relaxed flex-grow">{desc}</p>
      <div className="mt-4 flex items-center text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
        Initialize Mission 🚀
      </div>
    </motion.div>
  </Link>
);

export default function Dashboard() {
  const { xp, playerLevel } = useGameStore();

  // 🎮 قائمة الألعاب المتاحة
  const games = [
    {
      title: "Atomic Arena",
      path: "/games/AtomicArena",
      icon: "⚛️",
      desc:
        "Synthesize complex molecules by capturing falling atoms. Master the chemical bonds.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Neon Math Pro",
      path: "/games/NeonMathAdvancedPro",
      icon: "🔢",
      desc:
        "Advanced arithmetic challenges with neon aesthetics. Speed and accuracy are key.",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Bio Logic Chain",
      path: "/games/BioLogicChain",
      icon: "🧬",
      desc:
        "Sequence DNA and biological structures to unlock life's core mysteries.",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Sentence Architect",
      path: "/games/SentenceArchitect",
      icon: "✍️",
      desc:
        "Build complex linguistic structures and master English grammar and syntax.",
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Neural Grid",
      path: "/games/neuralGrid",
      icon: "🧠",
      desc:
        "Pattern recognition and logical sequence decoding within a neural network.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Geometry Memory",
      path: "/games/geometry",
      icon: "📐",
      desc: "Memorize complex geometric patterns and spatial arrangements.",
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Sudoku AI",
      path: "/games/sudoku",
      icon: "🧩",
      desc:
        "Classic logic puzzles enhanced with AI assistance for deep cognitive training.",
      color: "from-zinc-400 to-slate-600",
    },
    {
      title: "Memory AI",
      path: "/games/memory",
      icon: "💾",
      desc: "High-speed memory retention training using neural-linked visuals.",
      color: "from-cyan-400 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-mono">
      {/* 🔝 الهيدر العلوي - معلومات اللاعب */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-zinc-500 text-xs tracking-[0.5em] uppercase mb-2">
            Central Command
          </h2>
          <h1 className="text-6xl font-black tracking-tighter">MINDLAB_OS</h1>
        </div>
        <div className="flex gap-10">
          <div className="text-right">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Total_Energy
            </p>
            <p className="text-3xl font-black text-cyan-500">
              {xp} <span className="text-xs">XP</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
              Security_Clearance
            </p>
            <p className="text-3xl font-black text-white">LVL_{playerLevel}</p>
          </div>
        </div>
      </div>

      {/* 🎮 شبكة الألعاب */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.map((game, index) => (
            <GameCard key={index} {...game} />
          ))}
        </div>
      </div>

      {/* 🔻 تذييل الصفحة - زخرفة */}
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex justify-between items-center opacity-30">
        <p className="text-[10px] uppercase tracking-[0.3em]">
          Quantum Computing Active
        </p>
        <p className="text-[10px] uppercase tracking-[0.3em]">
          System Time: 2026.04.03
        </p>
      </div>
    </div>
  );
}
