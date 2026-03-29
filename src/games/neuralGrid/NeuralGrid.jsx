"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../core/sounds";
import { generateAIGrid } from "../../ai/aiGridGenerator";

export default function NeuralGrid() {
  const [stage, setStage] = useState("PRIMARY");
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("loading"); // loading, playing, success, error
  const [score, setScore] = useState(0);

  // تحميل التحدي الجديد
  const nextChallenge = useCallback(async () => {
    setStatus("loading");
    setUserInput("");

    // نستخدم المحرك بوضع GRID وحجم 3x3
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
        if (level % 5 === 0) playSound("win");
        setLevel((l) => l + 1);
      }, 1500);
    } else {
      playSound("wrong");
      setStatus("error");
      setTimeout(() => setStatus("playing"), 1000); // إتاحة المحاولة مرة أخرى
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-8 font-sans">
      {/* 1. TOP NAV - Stage Selector */}
      <div className="mb-12 flex flex-col items-center gap-4">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black">
          Neural Training
        </h2>
        <div className="flex bg-zinc-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
          {["PRIMARY", "MIDDLE", "SECONDARY"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStage(s);
                setLevel(1);
                setScore(0);
              }}
              className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${
                stage === s
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 2. STATS BAR */}
      <div className="w-full max-w-sm grid grid-cols-3 bg-zinc-900/30 p-6 rounded-3xl border border-white/5 mb-12 shadow-2xl">
        <StatItem label="LVL" value={level} color="text-blue-400" />
        <StatItem label="SCORE" value={score} color="text-green-400" />
        <StatItem
          label="STAGE"
          value={stage.charAt(0)}
          color="text-yellow-500"
        />
      </div>

      {/* 3. MAIN GRID */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
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
                  transition={{ delay: (rIdx * 3 + cIdx) * 0.05 }}
                  className={`w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center rounded-2xl text-2xl font-black border-2 transition-all duration-500 ${
                    cell === "?"
                      ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.2)] animate-pulse"
                      : "bg-zinc-900 border-white/5 text-zinc-400"
                  }`}
                >
                  {cell}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 4. INPUT AREA */}
      <div className="mt-12 w-full max-w-xs">
        <form onSubmit={checkAnswer} className="relative group">
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={status !== "playing"}
            placeholder="?"
            className={`w-full bg-zinc-900 border-2 rounded-2xl py-5 text-center text-3xl font-black outline-none transition-all duration-300 ${
              status === "success"
                ? "border-green-500 bg-green-500/10 text-green-400"
                : status === "error"
                ? "border-red-500 bg-red-500/10 text-red-400 animate-shake"
                : "border-white/10 focus:border-blue-600 text-white"
            }`}
            autoFocus
          />
          <button
            type="submit"
            className="hidden" // الزر مخفي، الإدخال يتم عبر مفتاح Enter
          >
            Submit
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
            {status === "success"
              ? "Brilliant Correction!"
              : status === "error"
              ? "Pattern Mismatch - Try Again"
              : "Decipher the sequence pattern"}
          </p>
        </div>
      </div>
    </div>
  );
}

// مكون صغير لعرض الإحصائيات
function StatItem({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] font-black text-zinc-600 mb-1 tracking-widest">
        {label}
      </span>
      <span className={`text-2xl font-black ${color} tabular-nums`}>
        {value}
      </span>
    </div>
  );
}
