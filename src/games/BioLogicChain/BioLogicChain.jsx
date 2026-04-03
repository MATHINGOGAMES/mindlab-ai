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
  const [core, setCore] = useState([]);
  const [orbit, setOrbit] = useState([]);
  const [options, setOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReactionComplete, setIsReactionComplete] = useState(false); // حالة جديدة للتحقق

  const current = ATOMIC_MISSIONS[missionIdx];

  const initAtom = useCallback(() => {
    const allParts = [...current.parts].sort(() => Math.random() - 0.5);
    setOptions(allParts);
    setCore([]);
    setOrbit([]);
    setIsReactionComplete(false); // إعادة تصفير الحالة
  }, [current]);

  useEffect(() => {
    initAtom();
  }, [initAtom]);

  const handlePartClick = (part, index) => {
    if (isReactionComplete) return; // منع الضغط بعد الاكتمال
    playSound("click");

    if (part.includes("Electron")) {
      setOrbit((prev) => [...prev, part]);
    } else {
      setCore((prev) => [...prev, part]);
    }

    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);

    if (newOptions.length === 0) {
      setIsReactionComplete(true);
      playSound("correct");
    }
  };

  const handleNextElement = () => {
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
        <title>Atomic Lab | MindLab Pro AI</title>
      </Helmet>

      {/* --- Nuclear Dashboard --- */}
      <div className="w-full max-w-md bg-zinc-900/50 border border-cyan-500/30 rounded-[2rem] p-6 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <div className="flex justify-between items-center">
          <div className="h-10 w-10 border-2 border-cyan-500 rounded-lg flex items-center justify-center text-cyan-500 font-black text-xl animate-pulse">
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
        <div
          className={`absolute w-72 h-72 border ${
            isReactionComplete ? "border-cyan-500" : "border-white/5"
          } rounded-full animate-[spin_10s_linear_infinite] transition-colors`}
        />

        <motion.div
          animate={
            isReactionComplete
              ? { scale: [1, 1.2, 1], rotate: 360 }
              : { scale: [1, 1.05, 1] }
          }
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-24 h-24 ${
            isReactionComplete
              ? "bg-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.6)]"
              : "bg-cyan-500/10"
          } border-2 border-cyan-500/40 rounded-full flex flex-wrap gap-1 items-center justify-center p-2 transition-all`}
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

      {/* --- Action Center: زر المتابعة الجديد --- */}
      <div className="h-24 mb-6 text-center">
        {!isReactionComplete ? (
          <div className="space-y-2">
            <h3 className="text-cyan-400 font-black text-lg tracking-widest uppercase">
              {current.task}
            </h3>
            <p className="text-zinc-500 text-[11px] italic">{current.fact}</p>
          </div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleNextElement}
            className="px-12 py-4 bg-cyan-500 text-black font-black rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-110 transition-transform uppercase tracking-tighter"
          >
            Synthesize Next Element →
          </motion.button>
        )}
      </div>

      {/* --- Particle Selection --- */}
      <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
        <AnimatePresence>
          {!isReactionComplete &&
            options.map((part, i) => (
              <motion.button
                key={part}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{
                  x: 10,
                  backgroundColor: "rgba(6, 182, 212, 0.1)",
                }}
                onClick={() => handlePartClick(part, i)}
                className="p-4 bg-zinc-900 border border-white/5 rounded-2xl flex justify-between items-center group transition-all"
              >
                <span className="font-black text-zinc-400 group-hover:text-cyan-400 tracking-tighter">
                  {part}
                </span>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              </motion.button>
            ))}
        </AnimatePresence>
      </div>

      <ResultModal
        isOpen={isModalOpen}
        status="win"
        score={350}
        onRestart={() => window.location.reload()}
      />
    </div>
  );
}
