import React from "react";
import { motion } from "framer-motion";

// الألوان الخاصة بـ H-Zero (سيان نووي)
const MONSTER_COLORS = {
  primary: "cyan",
  secondary: "zinc",
  accent: "white",
};

const IDCard = () => {
  // بيانات H-Zero (العنصر الأولي)
  const m = {
    id: "MSTR_001",
    name: "H-Zero",
    title: "The Proto-Element",
    element: "Hydrogen (H)",
    rarity: "Basic Catalyst",
    stats: {
      linguisticLogic: 85,
      atomicEnergy: 90,
      processingSpeed: 70,
    },
    legacy: "Molly's First Synthesis.",
    description:
      "A small, transparent, and resilient being. It has a single proton that pulses with raw potential. This little one can start any logic chain and is essential for all life forms.",
  };
  const c = MONSTER_COLORS;

  return (
    <div className="flex items-center justify-center p-6 bg-zinc-950 rounded-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-sm p-8 bg-zinc-900 border-2 border-cyan-500/20 rounded-[3rem] shadow-[0_0_60px_rgba(6,182,212,0.1)] relative overflow-hidden`}
      >
        {/* --- Background Effect --- */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/5 blur-3xl -z-0" />

        {/* --- Header Area --- */}
        <div className="flex justify-between items-start z-10 relative mb-10 border-b border-zinc-800 pb-6">
          <div>
            <p className="text-[7px] text-zinc-500 tracking-[0.4em] mb-1 uppercase">
              BioLogic_Synced
            </p>
            <h2 className="text-3xl font-black italic tracking-tighter text-cyan-400">
              {m.name}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[7px] text-zinc-500 tracking-[0.4em] mb-1">
              XP_CATALYST
            </p>
            <p className="text-2xl font-black text-white">v.1.0</p>
          </div>
        </div>

        {/* --- Monster Visuals --- */}
        <div className="w-full h-40 flex items-center justify-center z-10 relative mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 bg-black/40 border-2 border-cyan-500/30 rounded-full flex items-center justify-center p-1 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden"
          >
            {/* تم تصحيح السطر أدناه: إضافة علامات التنصيص واسم الملف الصحيح */}
            <img
              src="/He-Double.jpg"
              alt="H-Zero Genesis"
              className="w-full h-full object-cover scale-110 rounded-full"
            />
          </motion.div>
        </div>

        {/* --- Monster Stats & Info --- */}
        <div className="space-y-6 z-10 relative mb-10">
          <div className="text-center">
            <h3 className="text-white font-black text-lg tracking-tighter uppercase mb-1">
              {m.title}
            </h3>
            <p className="text-zinc-600 text-[10px] leading-relaxed">
              {m.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
            <div className="space-y-3">
              <h4 className="text-cyan-400 font-bold text-xs uppercase">
                Core Stats
              </h4>
              {[
                { label: "Linguistic Logic", value: m.stats.linguisticLogic },
                { label: "Atomic Energy", value: m.stats.atomicEnergy },
                { label: "Processing Speed", value: m.stats.processingSpeed },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-zinc-500 text-[10px]">
                    {stat.label}
                  </span>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right flex flex-col justify-center gap-1">
              <h4 className="text-zinc-400 font-bold text-[10px] uppercase mb-2">
                Protocol Data
              </h4>
              <p className="text-white text-[11px] font-bold">{m.element}</p>
              <p className="text-zinc-500 text-[9px]">{m.rarity}</p>
              <p className="text-white text-[10px] italic mt-3 bg-zinc-800/30 p-2 rounded-lg">
                "{m.legacy}"
              </p>
            </div>
          </div>
        </div>

        {/* --- Footer Area --- */}
        <div className="border-t border-zinc-800 z-10 relative pt-6 text-center opacity-30 flex items-center justify-between">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
          <p className="text-zinc-600 text-[8px] font-mono">
            MindLab_Pro_AI | v.Syn synced
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default IDCard;
