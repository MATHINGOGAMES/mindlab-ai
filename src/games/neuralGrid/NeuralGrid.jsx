"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { playSound } from "../../core/sounds";
import { generateAIGrid } from "../../ai/aiGridGenerator";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

export default function NeuralGrid() {
  const [stage, setStage] = useState("PRIMARY");
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("loading");
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load challenge
  const nextChallenge = useCallback(async () => {
    setStatus("loading");
    setUserInput("");

    const data = await generateAIGrid(level, 3, "GRID", stage);

    if (data && data.displayGrid) {
      setGrid(data.displayGrid);
      setAnswer(data.answer);
      setStatus("playing");
    }
  }, [level, stage]);

  useEffect(() => {
    nextChallenge();
  }, [nextChallenge]);

  const checkAnswer = (e) => {
    e.preventDefault();
    if (status !== "playing" || userInput === "") return;

    if (parseInt(userInput) === answer) {
      playSound("correct");
      setStatus("success");
      setScore((s) => s + 50);

      setTimeout(() => setIsModalOpen(true), 1000);
    } else {
      playSound("wrong");
      setStatus("error");
      setTimeout(() => setStatus("playing"), 1000);
    }
  };

  return (
    <>
      <Helmet>
        <title>Neural Grid | Pattern Recognition Game | MINDLAB</title>
        <meta
          name="description"
          content={`Solve AI-generated patterns. Stage: ${stage}`}
        />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-8 font-sans">
        {/* Stage Selector */}
        <div className="mb-12 flex flex-col items-center gap-4">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black">
            Neural Training
          </h2>

          <div className="flex bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5">
            {["PRIMARY", "MIDDLE", "SECONDARY"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStage(s);
                  setLevel(1);
                  setScore(0);
                }}
                className={`px-6 py-2 rounded-xl text-xs font-black ${
                  stage === s ? "bg-blue-600 text-white" : "text-zinc-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-sm grid grid-cols-3 bg-zinc-900/30 p-6 rounded-3xl mb-12">
          <StatItem label="LVL" value={level} color="text-blue-400" />
          <StatItem label="SCORE" value={score} color="text-green-400" />
          <StatItem label="STAGE" value={stage[0]} color="text-yellow-500" />
        </div>

        {/* Grid + Input */}
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full justify-center">
          {/* 🔹 Neural Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-0 bg-[#121212] p-2 rounded-3xl shadow-[0_0_60px_rgba(0,210,255,0.4)] border-[8px] border-[#00d2ff]/30">
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const borderTop =
                  rIdx % 3 === 0
                    ? "border-t-4 border-t-[#00d2ff]/50"
                    : "border-t border-t-[#00d2ff]/20";
                const borderLeft =
                  cIdx % 3 === 0
                    ? "border-l-4 border-l-[#00d2ff]/50"
                    : "border-l border-l-[#00d2ff]/20";
                const borderRight =
                  (cIdx + 1) % 3 === 0
                    ? "border-r-4 border-r-[#00d2ff]/50"
                    : "border-r border-r-[#00d2ff]/20";
                const borderBottom =
                  (rIdx + 1) % 3 === 0
                    ? "border-b-4 border-b-[#00d2ff]/50"
                    : "border-b border-b-[#00d2ff]/20";

                return (
                  <motion.div
                    key={`${rIdx}-${cIdx}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-20 h-20 flex items-center justify-center rounded-2xl text-2xl font-black ${borderTop} ${borderLeft} ${borderRight} ${borderBottom} ${
                      cell === "?"
                        ? "bg-blue-600/20 text-blue-400 animate-pulse"
                        : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {cell}
                  </motion.div>
                );
              })
            )}
          </div>

          {/* 🔹 Input Panel */}
          <div className="flex flex-col gap-6 bg-[#111111]/80 p-6 rounded-[2.5rem] border border-[#00d2ff]/20 backdrop-blur-sm">
            <form onSubmit={checkAnswer}>
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={status !== "playing"}
                className="w-40 bg-zinc-900 border-2 border-white/10 rounded-2xl py-5 text-center text-3xl font-black"
                placeholder="?"
              />
            </form>

            <p className="text-center text-xs mt-4 text-zinc-500">
              {status === "success"
                ? "Correct!"
                : status === "error"
                ? "Wrong!"
                : "Find the pattern"}
            </p>
          </div>
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={isModalOpen}
          status="win"
          score={score}
          time="Fast"
          onRestart={() => {
            setIsModalOpen(false);
            nextChallenge();
          }}
          nextLevel={() => {
            setIsModalOpen(false);
            setLevel((l) => l + 1);
          }}
        />

        {/* Description */}
        <div className="max-w-3xl mt-16 text-center leading-relaxed">
          <h2 className="text-2xl font-black text-purple-400 mb-4">
            🧠 Neural Grid – Description
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Neural Grid is an AI-powered brain-training game that strengthens
            pattern recognition, visual memory, and problem-solving skills.
          </p>
          <p className="text-zinc-500 text-sm mb-10">
            Each stage increases in difficulty, requiring sharper attention,
            faster recall, and enhanced cognitive processing.
          </p>
        </div>
      </div>
    </>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] text-zinc-600">{label}</span>
      <span className={`text-2xl font-black ${color}`}>{value}</span>
    </div>
  );
}
