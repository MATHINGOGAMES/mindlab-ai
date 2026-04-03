"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../core/store";
import { playSound } from "../../core/sounds";
import { generateAIGrid } from "../../ai/aiGridGenerator";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

export default function NeuralGridPro() {
  const { addXP, rank, level: globalLevel } = useGameStore();

  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("loading");
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [powers, setPowers] = useState({ slow: 3, reveal: 2 });
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flash, setFlash] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const vibrate = (pattern) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const nextChallenge = useCallback(async () => {
    setStatus("loading");
    setUserInput("");
    try {
      const data = await generateAIGrid(level, 3, "GRID", "PRIMARY");
      if (data?.displayGrid) {
        setGrid(data.displayGrid);
        setAnswer(data.answer);
        setEnergy(100);
        setStatus("playing");
        startTimeRef.current = Date.now();
      }
    } catch (err) {
      console.error("Neural Link Failed", err);
    }
  }, [level]);

  useEffect(() => {
    nextChallenge();
  }, [nextChallenge]);

  useEffect(() => {
    if (status === "playing" && energy > 0) {
      const decayBase = 0.4 + level * 0.08;
      const speed = isSlowMo ? 0.08 : decayBase;
      timerRef.current = setInterval(() => {
        setEnergy((e) => {
          if (e <= 0) {
            handleTimeout();
            return 0;
          }
          return e - speed;
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [status, energy, level, isSlowMo]);

  const handleTimeout = () => {
    playSound("wrong");
    vibrate([100, 50, 100]);
    setStatus("lost");
    setIsModalOpen(true);
  };

  const processSuccess = (time) => {
    playSound("correct");
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
    vibrate(30);

    const newCombo = combo + 1;
    setCombo(newCombo);

    let points = Math.floor(energy * 10) * (1 + newCombo * 0.2);
    if (time < 2) points *= 1.5;

    setScore((s) => s + Math.floor(points));
    addXP(Math.floor(points / 10));
    setStatus("success");

    setTimeout(() => {
      setLevel((l) => l + 1);
    }, 500);
  };

  const processFailure = () => {
    playSound("wrong");
    vibrate([50, 100, 50]);
    setCombo(0);
    setStatus("error");
    setEnergy((e) => Math.max(0, e - 25));
    setTimeout(() => {
      setStatus("playing");
      setUserInput("");
    }, 700);
  };

  const submit = useCallback(() => {
    if (!userInput || status !== "playing") return;
    const isCorrect = parseInt(userInput) === answer;
    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    isCorrect ? processSuccess(timeTaken) : processFailure();
  }, [userInput, answer, status, energy, combo]);

  useEffect(() => {
    if (
      answer &&
      userInput.length >= answer.toString().length &&
      status === "playing"
    ) {
      const t = setTimeout(submit, 300);
      return () => clearTimeout(t);
    }
  }, [userInput, answer, submit, status]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-4 font-mono select-none overflow-x-hidden">
      <Helmet>
        <title>Neural Grid Pro+ | MindLab AI</title>
      </Helmet>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cyan-500 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* HUD Header */}
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-5 mb-8 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[7px] text-cyan-500 tracking-[0.4em] mb-1 uppercase">
              Neural_Link_Established
            </p>
            <h2 className="text-2xl font-black italic tracking-tighter">
              {rank?.split("_")[0]}{" "}
              <span className="text-zinc-600 text-sm">v.{globalLevel}</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[7px] text-zinc-500 tracking-[0.4em] mb-1">
              SESSION_XP
            </p>
            <p className="text-2xl font-black text-amber-500">
              {score.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="relative w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${energy}%` }}
            className={`h-full ${energy < 30 ? "bg-red-600" : "bg-cyan-500"}`}
            style={{
              boxShadow: energy < 30 ? "0 0 15px #dc2626" : "0 0 15px #06b6d4",
            }}
          />
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-md">
        <div className="relative">
          <AnimatePresence>
            {combo > 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 -right-8 bg-fuchsia-600 text-black px-3 py-1 rounded-full text-xs font-black rotate-12 z-10"
              >
                {" "}
                X{(1 + combo * 0.2).toFixed(1)} MULTIPLIER{" "}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={level}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="grid grid-cols-3 gap-3 p-5 bg-[#080808] rounded-[3rem] border border-white/10 shadow-2xl relative"
          >
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl text-3xl font-black border ${
                    cell === "?"
                      ? "border-cyan-500 bg-cyan-500/5 text-white animate-pulse"
                      : "border-white/5 bg-zinc-900/50 text-zinc-500"
                  }`}
                >
                  {cell}
                </div>
              ))
            )}
          </motion.div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-zinc-800 text-4xl font-thin tracking-widest">
              {">>"}
            </span>
            <motion.div
              key={userInput}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-7xl font-black tracking-tighter min-w-[120px] ${
                status === "error" ? "text-red-500" : "text-white"
              }`}
            >
              {" "}
              {userInput || "---"}{" "}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Keypad */}
      <div className="w-full max-w-sm mt-12 space-y-4 pb-10">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "GO"].map((k) => (
            <button
              key={k}
              onClick={() => {
                vibrate(10);
                if (k === "⌫") setUserInput("");
                else if (k === "GO") submit();
                else if (userInput.length < 5) setUserInput((prev) => prev + k);
              }}
              className={`h-16 rounded-2xl text-2xl font-black border ${
                k === "GO"
                  ? "bg-cyan-600 text-black border-cyan-400"
                  : "bg-zinc-900 text-white border-white/5"
              }`}
            >
              {" "}
              {k}{" "}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            disabled={powers.slow === 0 || isSlowMo}
            onClick={() => {
              setPowers((p) => ({ ...p, slow: p.slow - 1 }));
              setIsSlowMo(true);
              playSound("powerup");
              setTimeout(() => setIsSlowMo(false), 5000);
            }}
            className={`flex-1 h-14 rounded-2xl border font-black text-[10px] ${
              isSlowMo
                ? "bg-cyan-500 text-black animate-pulse"
                : "bg-zinc-950 text-zinc-500"
            }`}
          >
            {" "}
            {isSlowMo ? "SYSTEM_DILATED" : `🧊 TIME_WARP [${powers.slow}]`}{" "}
          </button>
          <button
            disabled={powers.reveal === 0}
            onClick={() => {
              setPowers((p) => ({ ...p, reveal: p.reveal - 1 }));
              setUserInput(answer?.toString() || "");
              playSound("powerup");
            }}
            className="flex-1 h-14 rounded-2xl border bg-zinc-950 text-zinc-500 border-white/5 font-black text-[10px]"
          >
            {" "}
            💡 REVEAL_NODE [{powers.reveal}]{" "}
          </button>
        </div>
      </div>

      <ResultModal
        isOpen={isModalOpen}
        status={status === "lost" ? "lose" : "win"}
        score={score}
        onRestart={() => window.location.reload()}
        nextLevel={() => {
          setIsModalOpen(false);
          nextChallenge();
        }}
      />

      {/* --- FUTURISTIC SEO FOOTER --- */}
      <footer className="w-full max-w-3xl mt-20 border-t border-white/5 pt-10 pb-16 px-6 text-center">
        {/* Branding */}
        <div className="mb-6">
          <h3 className="text-cyan-400 font-black text-lg tracking-widest uppercase">
            MindLab AI System
          </h3>
          <p className="text-zinc-500 text-xs mt-2">
            Advanced Brain Training • AI-Powered Learning • Next-Gen Cognitive
            Games
          </p>
        </div>

        {/* Description (SEO قوي) */}
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
          <strong className="text-white">Neural Grid Pro+</strong> is an
          advanced AI-powered brain training game designed to improve logical
          thinking, pattern recognition, and problem-solving skills. Built using
          cutting-edge{" "}
          <span className="text-cyan-400">AI grid generation technology</span>,
          this interactive experience challenges players with dynamic puzzles
          that evolve in real-time.
        </p>

        {/* Features */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-[10px] text-zinc-500">
          {[
            "Brain Training Game",
            "AI Puzzle Generator",
            "Logic & Pattern Recognition",
            "Cognitive Skills Development",
            "Interactive Learning Game",
            "Neural Challenge System",
          ].map((tag) => (
            <span
              key={tag}
              className="border border-zinc-700 px-2 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <p className="text-zinc-600 text-xs mb-2">
            Ready to push your brain beyond limits?
          </p>
          <p className="text-cyan-400 font-bold text-sm">
            Train • Improve • Dominate 🧠⚡
          </p>
        </div>

        {/* Bottom Line */}
        <div className="mt-10 text-[10px] text-zinc-700 tracking-widest">
          © {new Date().getFullYear()} MindLab AI • All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
