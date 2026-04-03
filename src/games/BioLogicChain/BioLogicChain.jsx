"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../core/store";
import { playSound } from "../../core/sounds";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

const ATOMIC_MISSIONS = [
  {
    id: 1,
    element: "Hydrogen (H)",
    task: "Build the Simplest Atom",
    parts: ["1 Proton", "1 Electron", "0 Neutrons"],
    fact: "Hydrogen is the first element in the Periodic Table.",
    xp: 150,
  },
  {
    id: 2,
    element: "Helium (He)",
    task: "The Noble Gas Structure",
    parts: ["2 Protons", "2 Neutrons", "2 Electrons"],
    fact: "Helium is used in balloons because it is lighter than air.",
    xp: 200,
  },
];

export default function AtomicLab() {
  const { addXP, rank, level: globalLevel } = useGameStore();
  const [missionIdx, setMissionIdx] = useState(0);
  const [core, setCore] = useState([]); // النواة (Protons & Neutrons)
  const [orbit, setOrbit] = useState([]); // المدار (Electrons)
  const [options, setOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const current = ATOMIC_MISSIONS[missionIdx];

  const initAtom = useCallback(() => {
    // خلط المكونات
    const allParts = [...current.parts].sort(() => Math.random() - 0.5);
    setOptions(allParts);
    setCore([]);
    setOrbit([]);
  }, [current]);

  useEffect(() => {
    initAtom();
  }, [initAtom]);

  const handlePartClick = (part, index) => {
    playSound("click");

    // تصنيف المكون لغرض الرسم البصري
    if (part.includes("Electron")) {
      setOrbit((prev) => [...prev, part]);
    } else {
      setCore((prev) => [...prev, part]);
    }

    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);

    if (newOptions.length === 0) {
      setTimeout(checkAtomicLogic, 800);
    }
  };

  const checkAtomicLogic = () => {
    // في هذا المستوى، نتحقق فقط من اكتمال التجميع
    playSound("correct");
    addXP(current.xp);
    if (missionIdx < ATOMIC_MISSIONS.length - 1) {
      setMissionIdx((prev) => prev + 1);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 flex flex-col items-center font-mono overflow-hidden">
      <Helmet>
        <title>Atomic Lab | Periodic Table English</title>
      </Helmet>

      {/* --- Nuclear Dashboard --- */}
      <div className="w-full max-w-md bg-zinc-900/50 border border-cyan-500/30 rounded-[2rem] p-6 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div className="flex justify-between items-center">
          <div className="h-10 w-10 border-2 border-cyan-500 rounded-lg flex items-center justify-center text-cyan-500 font-black text-xl">
            {current.element[0]}
          </div>
          <div className="text-right">
            <p className="text-[7px] text-cyan-500 tracking-widest uppercase mb-1">
              Atomic_Engine_v1.0
            </p>
            <h2 className="text-xl font-black italic tracking-tighter text-zinc-300">
              {current.element}
            </h2>
          </div>
        </div>
      </div>

      {/* --- The Atom Visualizer --- */}
      <div className="relative w-80 h-80 mb-12 flex items-center justify-center">
        {/* Orbits (Visual) */}
        <div className="absolute w-72 h-72 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
        <div className="absolute w-56 h-56 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

        {/* Core (Nucleus) */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 bg-cyan-500/10 border-2 border-cyan-500/40 rounded-full flex flex-wrap gap-1 items-center justify-center p-2 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
        >
          {core.map((p, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                p.includes("Proton")
                  ? "bg-red-500 shadow-[0_0_10px_red]"
                  : "bg-zinc-400"
              }`}
            />
          ))}
        </motion.div>

        {/* Orbiting Electrons */}
        {orbit.map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
            className="absolute w-full h-full"
          >
            <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] absolute top-0 left-1/2 -translate-x-1/2" />
          </motion.div>
        ))}
      </div>

      {/* --- Mission Text --- */}
      <div className="text-center mb-10">
        <h3 className="text-cyan-400 font-black text-lg tracking-widest uppercase mb-2">
          {current.task}
        </h3>
        <p className="text-zinc-500 text-[11px] max-w-xs mx-auto italic leading-relaxed">
          {current.fact}
        </p>
      </div>

      {/* --- Particle Selection (English Terms) --- */}
      <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
        {options.map((part, i) => (
          <motion.button
            key={i}
            whileHover={{ x: 10, backgroundColor: "rgba(6, 182, 212, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePartClick(part, i)}
            className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex justify-between items-center group transition-all"
          >
            <span className="font-black text-zinc-400 group-hover:text-cyan-400 tracking-tighter">
              {part}
            </span>
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
          </motion.button>
        ))}
      </div>

      <ResultModal
        isOpen={isModalOpen}
        status="win"
        score={current.xp}
        victoryMessage="Molly says: You are not just learning English; you are understanding the building blocks of the Universe."
        onRestart={() => window.location.reload()}
      />

      {/* --- Atomic SEO Footer --- */}
      <footer className="w-full max-w-3xl mt-20 border-t border-white/5 pt-8 pb-10 opacity-50">
        <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
          <strong>Academic English Integration:</strong> Periodic Table Literacy
          for kids. Mastering terms like <em>Proton</em>, <em>Neutron</em>, and{" "}
          <em>Electron</em> within an immersive AI environment designed for the{" "}
          <strong>MindLab Pro</strong> ecosystem.
        </p>
      </footer>
    </div>
  );
}
