"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../core/sounds";
import { generateAIGrid } from "../../ai/aiGridGenerator";

export default function MemoryAI() {
  const [stage, setStage] = useState("PRIMARY");
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [status, setStatus] = useState("loading");
  const [score, setScore] = useState(0);

  // تحميل المستوى
  const loadGame = useCallback(async () => {
    setStatus("loading");
    const pairCount = Math.min(4 + Math.floor(level / 2), 10);
    const data = await generateAIGrid(level, pairCount, "PAIRS", stage);

    if (data && data.cards && data.cards.length > 0) {
      setCards(data.cards);
      setFlipped([]);
      setSolved([]);
      setStatus("playing");
    }
  }, [level, stage]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  const handleCardClick = (idx) => {
    if (status !== "playing" || flipped.includes(idx) || solved.includes(idx))
      return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setStatus("checking");
      const [c1, c2] = [cards[newFlipped[0]], cards[newFlipped[1]]];

      if (c1.matchId === c2.matchId) {
        playSound("correct");
        setSolved((prev) => [...prev, newFlipped[0], newFlipped[1]]);
        setFlipped([]);
        setScore((s) => s + 20);
        setStatus("playing");
      } else {
        playSound("wrong");
        setTimeout(() => {
          setFlipped([]);
          setStatus("playing");
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && solved.length === cards.length) {
      playSound("win");
      setTimeout(() => setLevel((l) => l + 1), 1500);
    }
  }, [solved, cards]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col items-center font-sans">
      {/* 1. Header & Stage Selector */}
      <div className="mb-10 flex flex-col items-center gap-4">
        <h1 className="text-[10px] tracking-[5px] text-zinc-500 font-black uppercase">
          Educational Path
        </h1>
        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          {["PRIMARY", "MIDDLE", "SECONDARY"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStage(s);
                setLevel(1);
                setScore(0);
              }}
              className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${
                stage === s
                  ? "bg-purple-600 shadow-xl scale-105"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Stats HUD */}
      <div className="grid grid-cols-3 gap-10 bg-zinc-900/30 px-12 py-6 rounded-3xl border border-white/5 mb-12 shadow-2xl">
        <Stat label="LEVEL" value={level} color="text-purple-400" />
        <Stat label="SCORE" value={score} color="text-green-400" />
        <Stat label="STAGE" value={stage.charAt(0)} color="text-yellow-500" />
      </div>

      {/* 3. Game Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
        {status === "loading" ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] text-zinc-600 tracking-widest animate-pulse">
              GENERATING AI PAIRS...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
              <div
                key={card.id}
                className="relative w-20 h-28 sm:w-28 sm:h-36 cursor-pointer"
                onClick={() => handleCardClick(idx)}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{
                    rotateY:
                      flipped.includes(idx) || solved.includes(idx) ? 180 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Back Face */}
                  <div className="absolute inset-0 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center backface-hidden shadow-lg">
                    <div className="w-6 h-6 rounded-full border border-purple-500/20 bg-purple-500/5" />
                  </div>

                  {/* Front Face (Content) */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded-2xl font-black text-sm sm:text-base border-2 shadow-2xl px-2 text-center ${
                      solved.includes(idx)
                        ? "bg-green-500/10 border-green-500 text-green-400"
                        : "bg-purple-600 border-white text-white"
                    }`}
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {card.content}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Footer Message */}
      <div className="mt-12">
        <AnimatePresence mode="wait">
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]"
          >
            {status === "playing" ? "Find the matching pairs" : "Verifying..."}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
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
