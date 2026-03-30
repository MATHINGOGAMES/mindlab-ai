"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { playSound } from "../../core/sounds";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

// Geometric Shapes with neon colors
const SHAPES = [
  { id: 1, icon: "▲", color: "bg-blue-500", shadow: "shadow-blue-500/50" },
  { id: 2, icon: "■", color: "bg-red-500", shadow: "shadow-red-500/50" },
  { id: 3, icon: "●", color: "bg-green-500", shadow: "shadow-green-500/50" },
  { id: 4, icon: "◆", color: "bg-yellow-500", shadow: "shadow-yellow-500/50" },
  { id: 5, icon: "⬢", color: "bg-purple-500", shadow: "shadow-purple-500/50" },
  { id: 6, icon: "★", color: "bg-pink-500", shadow: "shadow-pink-500/50" },
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

  const startNextLevel = useCallback(() => {
    setIsDisplaying(true);
    setUserSequence([]);
    const nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const newSequence = [...sequence, nextShape];
    setSequence(newSequence);
    playSequence(newSequence);
  }, [sequence]);

  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActiveShape(seq[i].id);
      playSound("correct");
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActiveShape(null);
    }
    setIsDisplaying(false);
  };

  const handleShapeClick = (shape) => {
    if (isDisplaying || isModalOpen) return;

    const newUserSequence = [...userSequence, shape];
    setUserSequence(newUserSequence);

    const currentIndex = newUserSequence.length - 1;
    if (shape.id !== sequence[currentIndex].id) {
      playSound("wrong");
      setStatus("lose");
      setIsModalOpen(true);
      return;
    }

    playSound("correct");
    if (newUserSequence.length === sequence.length) {
      setScore((s) => s + level * 10);
      setTimeout(() => {
        setLevel((l) => l + 1);
        startNextLevel();
      }, 800);
    }
  };

  useEffect(() => {
    startNextLevel();
  }, []);

  const resetGame = () => {
    setIsModalOpen(false);
    setSequence([]);
    setLevel(1);
    setScore(0);
    setTimeout(() => {
      const firstShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      setSequence([firstShape]);
      playSequence([firstShape]);
    }, 500);
  };

  return (
    <>
      <Helmet>
        <title>Geometry Memory | Sequence Brain Training | MINDLAB</title>
        <meta
          name="description"
          content="Train your brain with geometric sequences. Improve focus, memory, and cognitive speed through interactive pattern challenges."
        />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-8 font-sans">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-[10px] tracking-[5px] text-zinc-500 font-black uppercase mb-4">
            Visual Memory Core
          </h1>
          <div className="flex gap-8 bg-zinc-900/50 px-10 py-4 rounded-3xl border border-white/5 backdrop-blur-md">
            <Stat label="LEVEL" value={level} color="text-blue-400" />
            <Stat label="SCORE" value={score} color="text-green-400" />
          </div>
        </div>

        {/* Shape Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-md w-full">
          {SHAPES.map((shape) => (
            <motion.button
              key={shape.id}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px cyan" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShapeClick(shape)}
              className={`
                h-24 sm:h-32 rounded-3xl flex items-center justify-center text-5xl font-black transition-all duration-300
                ${
                  activeShape === shape.id
                    ? `${shape.color} ${shape.shadow} scale-110`
                    : "bg-zinc-900 border border-white/5 text-zinc-700"
                }
                ${
                  isDisplaying
                    ? "cursor-default"
                    : "cursor-pointer hover:border-white/20"
                }
              `}
            >
              {shape.icon}
            </motion.button>
          ))}
        </div>

        {/* Status */}
        <p className="mt-12 text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em] animate-pulse">
          {isDisplaying ? "Watch the Pattern..." : "Repeat the Sequence!"}
        </p>

        {/* Description Section */}
        <div className="max-w-3xl mt-16 text-center leading-relaxed">
          <h2 className="text-2xl font-black text-purple-400 mb-4">
            🧠 Geometric Memory Game – Description
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Geometric Memory is a neon-style brain-training game to enhance
            focus, visual memory, and pattern recognition. Players must repeat
            sequences of geometric shapes with increasing difficulty.
          </p>
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={isModalOpen}
          status={status}
          score={score}
          time={`Level ${level}`}
          onRestart={resetGame}
          nextLevel={resetGame}
        />
      </div>
    </>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] font-black text-zinc-600 tracking-widest mb-1">
        {label}
      </span>
      <span className={`text-2xl font-black ${color}`}>{value}</span>
    </div>
  );
}
