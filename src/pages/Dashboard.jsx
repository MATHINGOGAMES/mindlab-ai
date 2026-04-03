import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useGameStore } from "../core/store";
import { getSmartAdvice } from "../core/advisor";
import DailyQuests from "./DailyQuests";
import IDCard from "@/components/IDCard";

export default function Dashboard() {
  const { xp, level, rank, totalGames } = useGameStore();
  const [advice, setAdvice] = useState(null);

  useEffect(() => {
    const dailyAdvice = getSmartAdvice();
    setAdvice(dailyAdvice);
  }, []);

  const quickStats = [
    {
      label: "Current Rank",
      value: rank.replace("_", " "),
      color: "text-cyan-400",
    },
    { label: "System Level", value: `LVL_${level}`, color: "text-white" },
    { label: "Sessions", value: totalGames, color: "text-zinc-500" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 pt-24 font-mono selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER SECTION --- */}
        <header className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-[2px] bg-cyan-500" />
              <p className="text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-black">
                Authorized Personnel Only
              </p>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              MINDLAB{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-t from-cyan-600 to-cyan-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                AI
              </span>
            </h1>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {quickStats.map((stat, i) => (
              <div
                key={i}
                className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl min-w-[120px] backdrop-blur-md"
              >
                <p className="text-[8px] text-zinc-600 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <p className={`text-sm font-black uppercase ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* --- MAIN GRID SYSTEM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE: Daily Quests & Monster Progress */}
          <div className="lg:col-span-4 space-y-8">
            <DailyQuests />

            {/* Monster Vault Access Portal */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-zinc-900 to-cyan-950/30 border border-cyan-500/20 rounded-[2.5rem] cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-5 mb-4">
                <div className="text-3xl animate-pulse">👾</div>
                <h3 className="text-white font-black italic uppercase tracking-tighter text-lg">
                  The Monster Vault
                </h3>
              </div>
              <p className="text-cyan-500/60 text-[9px] font-mono tracking-widest mb-4">
                1/118 ELEMENTS SYNTHESIZED
              </p>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[1%] h-full bg-cyan-500 shadow-[0_0_10px_cyan]" />
              </div>
            </motion.div>

            {/* Neural Progression */}
            <div className="bg-[#080808] border border-white/5 p-6 rounded-[2rem]">
              <h3 className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-4">
                Neural_Progression
              </h3>
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-black text-white">
                  {xp}
                  <span className="text-xs text-zinc-700 ml-1">/100</span>
                </span>
                <span className="text-[10px] text-cyan-500 font-bold tracking-widest">
                  XP_SYNC_ACTIVE
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xp}%` }}
                  className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Active Monster & Game Modules */}
          <div className="lg:col-span-8 space-y-8">
            {/* AI ADVISOR */}
            <AnimatePresence>
              {advice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-[#0c0c0c] border border-white/5 p-8 rounded-[2.5rem]"
                >
                  <div className="flex items-center gap-2 mb-4 text-zinc-500 text-[10px] tracking-widest">
                    <span className="animate-pulse">●</span> [ AI_CORE_ADVICE ]
                  </div>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed text-zinc-200">
                    "{advice.en}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FEATURED UNIT: ID CARD */}
            <div className="w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] flex-grow bg-zinc-800" />
                <span className="text-[10px] text-zinc-600 font-bold tracking-[0.5em]">
                  ACTIVE_ENTITY_RECORDS
                </span>
                <div className="h-[1px] flex-grow bg-zinc-800" />
              </div>
              <IDCard />
            </div>

            {/* MODULES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModuleCard
                id="MOD_01"
                title="Word Hunter"
                desc="Advanced lexical processing unit."
                path="../games/WordCatcher"
                icon="📝"
                active
              />
              <ModuleCard
                id="MOD_02"
                title="Neural Grid"
                desc="Mathematical decryption protocol."
                path="../games/neuralGrid"
                icon="🧠"
                active
              />
              <ModuleCard
                id="MOD_03"
                title="Memory AI"
                desc="Pattern recognition protocol."
                path="../games/memory"
                icon="🔋"
                active
              />
              <ModuleCard
                id="MOD_04"
                title="Geometry Memory"
                desc="THE BEAST IS ACTIVE. Reach Node 10."
                path="../games/geometry"
                icon="🔔"
                active
              />
              <ModuleCard
                id="MOD_05"
                title="THE ARCHITECT"
                desc="Honoring Molly Stone. Build bridges."
                path="/games/SentenceArchitect"
                icon="🏗️"
                active
              />
              <ModuleCard
                id="MOD_06"
                title="Lexi-Lab: BioLogic"
                desc="Decode the logic of life."
                path="/games/BioLogicChain"
                icon="🧪"
                active
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

function ModuleCard({ id, title, desc, path, icon, active }) {
  return (
    <Link
      to={active ? path : "#"}
      className={active ? "group" : "cursor-not-allowed opacity-40"}
    >
      <motion.div
        whileHover={active ? { y: -5 } : {}}
        className="h-full p-8 bg-[#080808] border border-white/5 rounded-[2.5rem] group-hover:border-cyan-500/40 transition-all duration-500"
      >
        <div className="flex justify-between items-start mb-10">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
              active
                ? "bg-zinc-900 group-hover:bg-cyan-500 group-hover:text-black"
                : "bg-zinc-900"
            } transition-all duration-500`}
          >
            {icon}
          </div>
          <span className="text-[10px] text-zinc-700 font-black tracking-widest group-hover:text-cyan-500 transition-colors">
            {id}
          </span>
        </div>
        <h3 className="text-2xl font-black text-white mb-3 tracking-tighter group-hover:translate-x-1 transition-transform">
          {title}
        </h3>
        <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
      </motion.div>
    </Link>
  );
}
