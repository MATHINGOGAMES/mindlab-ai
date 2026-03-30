"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { playSound } from "../../core/sounds";
import { generateAIGrid } from "../../ai/aiGridGenerator";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

export default function MemoryAI() {
  const [stage, setStage] = useState("PRIMARY");
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [status, setStatus] = useState("loading");
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadGame = useCallback(async () => {
    setStatus("loading");
    const pairCount = Math.min(4 + Math.floor(level / 2), 10);
    const data = await generateAIGrid(level, pairCount, "PAIRS", stage);

    if (data && data.cards?.length > 0) {
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
      setIsModalOpen(true);
    }
  }, [solved, cards]);

  const handleNext = () => {
    setIsModalOpen(false);
    setLevel((l) => l + 1);
  };

  return (
    <>
      <Helmet>
        <title>Memory AI | Brain Training | MINDLAB</title>
        <meta
          name="description"
          content={`Match pairs and train memory. Stage: ${stage}`}
        />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col items-center font-sans">
        {/* Stage Selector */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <h1 className="text-[10px] tracking-[5px] text-zinc-500 font-black uppercase">
            Educational Path
          </h1>
          <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
            {["PRIMARY", "MIDDLE", "SECONDARY"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStage(s);
                  setLevel(1);
                  setScore(0);
                }}
                className={`px-6 py-2 rounded-xl text-xs font-black ${
                  stage === s ? "bg-purple-600 scale-105" : "text-zinc-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-10 bg-zinc-900/30 px-12 py-6 rounded-3xl mb-12">
          <Stat label="LEVEL" value={level} color="text-purple-400" />
          <Stat label="SCORE" value={score} color="text-green-400" />
          <Stat label="STAGE" value={stage[0]} color="text-yellow-500" />
        </div>

        {/* Memory Grid */}
        <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
          {status === "loading" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-500">GENERATING AI PAIRS...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {cards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  className="relative w-24 h-36 cursor-pointer"
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
                  >
                    {/* Back: مركبة فضائية 🛸 */}
                    <div className="absolute inset-0 bg-[#0f0f0f] rounded-2xl flex items-center justify-center text-3xl font-bold text-cyan-400 shadow-[0_0_20px_cyan]">
                      🛸
                    </div>

                    {/* Front */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-2xl font-bold text-2xl shadow-[0_0_20px_cyan] ${
                        solved.includes(idx)
                          ? "bg-green-500/20 text-green-400"
                          : "bg-[#1a0f3f] text-pink-400"
                      }`}
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      {card.content}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 text-xs text-zinc-500">
          {status === "playing" ? "Find pairs" : "Checking..."}
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={isModalOpen}
          status="win"
          score={score}
          time="N/A"
          onRestart={() => {
            setIsModalOpen(false);
            loadGame();
          }}
          nextLevel={handleNext}
        />
      </div>
    </>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
