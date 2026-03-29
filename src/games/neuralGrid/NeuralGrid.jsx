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

      setTimeout(() => {
        setIsModalOpen(true);
      }, 1000);
    } else {
      playSound("wrong");
      setStatus("error");
      setTimeout(() => setStatus("playing"), 1000);
    }
  };

  return (
    <>
      {/* SEO */}
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

        {/* Grid */}
        <div className="flex-1 flex items-center justify-center">
          {status === "loading" ? (
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {grid.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                  <motion.div
                    key={`${rIdx}-${cIdx}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-20 h-20 flex items-center justify-center rounded-2xl text-2xl font-black ${
                      cell === "?"
                        ? "bg-blue-600/20 text-blue-400 animate-pulse"
                        : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {cell}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mt-12 w-full max-w-xs">
          <form onSubmit={checkAnswer}>
            <input
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={status !== "playing"}
              className="w-full bg-zinc-900 border-2 border-white/10 rounded-2xl py-5 text-center text-3xl font-black"
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

        {/* 🧠 Neural Grid Description */}
        <div className="max-w-3xl mt-16 text-center leading-relaxed">
          <h2 className="text-2xl font-black text-purple-400 mb-4">
            🧠 Neural Grid – Description
          </h2>

          <p className="text-zinc-400 text-sm mb-6">
            Neural Grid is an AI-powered brain-training game that strengthens
            pattern recognition, visual memory, and problem-solving skills.
            Players are presented with AI-generated grids and must identify the
            hidden numbers or patterns with precision.
          </p>

          <p className="text-zinc-500 text-sm mb-10">
            Each stage increases in difficulty, requiring sharper attention,
            faster recall, and enhanced cognitive processing. This game combines
            logic, spatial awareness, and memory exercises into a fun, immersive
            experience.
          </p>

          <h3 className="text-xl font-bold text-white mb-4">
            🎯 Why It Matters (Benefits)
          </h3>

          <div className="grid sm:grid-cols-2 gap-6 text-left mb-10">
            <div>
              <h4 className="text-purple-400 font-semibold">
                Focus & Concentration
              </h4>
              <p className="text-zinc-500 text-sm">
                Improves sustained attention and mental clarity through pattern
                tracking.
              </p>
            </div>

            <div>
              <h4 className="text-purple-400 font-semibold">Visual Memory</h4>
              <p className="text-zinc-500 text-sm">
                Strengthens the ability to remember sequences, positions, and
                numerical patterns.
              </p>
            </div>

            <div>
              <h4 className="text-purple-400 font-semibold">Cognitive Speed</h4>
              <p className="text-zinc-500 text-sm">
                Trains the brain to process information quickly and react
                accurately.
              </p>
            </div>

            <div>
              <h4 className="text-purple-400 font-semibold">
                Problem-Solving Skills
              </h4>
              <p className="text-zinc-500 text-sm">
                Encourages logical thinking and deduction based on observed
                patterns.
              </p>
            </div>

            <div className="sm:col-span-2">
              <h4 className="text-purple-400 font-semibold">Mental Agility</h4>
              <p className="text-zinc-500 text-sm">
                Keeps your brain active, flexible, and responsive across
                challenges.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-4">
            🚀 The Experience
          </h3>

          <p className="text-zinc-400 text-sm">
            With AI-generated challenges and adaptive difficulty, each session
            is unique. Neural Grid is perfect for students, gamers, or anyone
            looking to sharpen their mind while having fun.
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
