"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateGrid } from "./engine";
import { useGameStore } from "../../core/store";
import { playSound } from "../../core/sounds";

/**
 * =========================================================
 * 🧠 NEURAL GRID - OFFICIAL GAME DESCRIPTION
 * =========================================================
 *
 * Neural Grid is a fast-paced brain-training puzzle game
 * that challenges players to detect hidden mathematical patterns.
 *
 * Each level presents a dynamic 3x3 grid generated from
 * arithmetic, geometric, or mixed sequences.
 * One number is hidden and replaced with a "?".
 *
 * 🎯 Your mission:
 * Analyze the pattern and find the missing number before time runs out.
 *
 * ---------------------------------------------------------
 * ⚡ CORE FEATURES
 * ---------------------------------------------------------
 * - Procedurally generated levels (infinite gameplay)
 * - Increasing difficulty based on player level
 * - Combo system for skilled players
 * - Time pressure mechanic for excitement
 * - Special ability: Time Freeze every 5 combos
 * - Instant visual + sound feedback
 *
 * ---------------------------------------------------------
 * 🚀 ADDICTIVE GAME LOOP (HOOK)
 * ---------------------------------------------------------
 * Solve → Earn Combo → Freeze Time → Score More → Level Up → Repeat
 *
 * The faster and more accurate you are,
 * the higher your combo and score will climb.
 *
 * ---------------------------------------------------------
 * 🧩 HOW TO PLAY
 * ---------------------------------------------------------
 * 1. Observe the number grid carefully
 * 2. Detect the hidden pattern
 * 3. Calculate the missing number
 * 4. Enter your answer before time ends
 *
 * ✔ Correct Answer:
 * - Gain points
 * - Increase combo
 * - Possible time freeze bonus
 *
 * ❌ Wrong Answer / Timeout:
 * - Combo resets
 * - Move to next challenge
 *
 * ---------------------------------------------------------
 * 🧠 SKILLS DEVELOPED
 * ---------------------------------------------------------
 * - Pattern Recognition
 * - Logical Thinking
 * - Mental Math
 * - Focus Under Pressure
 *
 * ---------------------------------------------------------
 * 🎮 PERFECT FOR:
 * Students, puzzle lovers, and brain training enthusiasts.
 *
 * Simple to learn. Hard to master. Highly addictive.
 * =========================================================
 */

export default function NeuralGrid() {
  const [gameState, setGameState] = useState({
    level: 1,
    data: generateGrid(1),
    input: "",
    time: 10,
    score: 0,
    combo: 0,
    feedback: "",
    status: "playing",
    isFrozen: false,
  });

  const addXP = useGameStore((s) => s.addXP);
  const inputRef = useRef(null);

  const nextLevel = useCallback(() => {
    setGameState((prev) => {
      const nextLvl = prev.level + 1;
      return {
        ...prev,
        level: nextLvl,
        data: generateGrid(nextLvl),
        input: "",
        time: 10,
        isFrozen: false,
        feedback: "",
        status: "playing",
      };
    });
  }, []);

  const handleFail = useCallback(() => {
    if (gameState.status === "checking") return;

    playSound("wrong");
    setGameState((prev) => ({
      ...prev,
      feedback: "❌ WRONG!",
      combo: 0,
      status: "checking",
    }));

    setTimeout(nextLevel, 800);
  }, [nextLevel, gameState.status]);

  const handleSuccess = useCallback(() => {
    playSound("correct");

    setGameState((prev) => {
      const newCombo = prev.combo + 1;
      const isNowFrozen = newCombo > 0 && newCombo % 5 === 0;
      const gained = 10 + newCombo * 2;

      if (isNowFrozen) playSound("win");
      addXP(gained);

      return {
        ...prev,
        combo: newCombo,
        score: prev.score + gained,
        isFrozen: isNowFrozen,
        feedback: isNowFrozen ? "❄️ TIME FROZEN!" : "✅ CORRECT!",
        status: "checking",
      };
    });

    setTimeout(nextLevel, 600);
  }, [addXP, nextLevel]);

  const checkAnswer = () => {
    if (gameState.status !== "playing" || !gameState.input) return;

    if (parseInt(gameState.input) === gameState.data.answer) {
      handleSuccess();
    } else {
      handleFail();
    }
  };

  useEffect(() => {
    if (gameState.isFrozen || gameState.status !== "playing") return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.time <= 1) {
          clearInterval(timer);
          handleFail();
          return { ...prev, time: 0 };
        }
        return { ...prev, time: prev.time - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.level, gameState.isFrozen, gameState.status, handleFail]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [gameState.level]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-60"></div>

      <div className="flex gap-10 mb-10 relative z-10 bg-black/40 border border-white/5 p-5 rounded-3xl backdrop-blur-xl shadow-inner">
        <StatItem
          label="Level"
          value={gameState.level}
          color="text-purple-400"
        />
        <StatItem
          label="Score"
          value={gameState.score}
          color="text-green-400"
        />
        <StatItem
          label="Combo"
          value={`x${gameState.combo}`}
          color="text-yellow-400"
        />
      </div>

      <h1 className="text-6xl font-black mb-12 relative z-10 tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        NEURAL GRID
      </h1>

      <div className="w-80 h-3 bg-gray-800 rounded-full mb-12 relative z-10 overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{
            width: `${(gameState.time / 10) * 100}%`,
            backgroundColor: gameState.isFrozen
              ? "#3b82f6"
              : gameState.time < 4
              ? "#ef4444"
              : "#a855f7",
          }}
          transition={{ duration: 0.3 }}
          className="h-full rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={gameState.level}
          className="grid grid-cols-3 gap-6 relative z-10 bg-gray-900/40 p-8 rounded-[2.5rem]"
        >
          {gameState.data.displayGrid.map((row, i) =>
            row.map((cell, j) => <GridCell key={`${i}-${j}`} cell={cell} />)
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-16 relative z-10 flex flex-col items-center gap-8">
        <input
          ref={inputRef}
          value={gameState.input}
          onChange={(e) =>
            setGameState((p) => ({
              ...p,
              input: e.target.value.replace(/[^0-9]/g, ""),
            }))
          }
          onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          className="bg-black border-4 border-purple-500 text-5xl text-center w-48 h-24 rounded-2xl"
          placeholder="?"
        />

        <button
          onClick={checkAnswer}
          className="px-10 py-3 bg-white text-black rounded-xl"
        >
          Submit
        </button>
      </div>

      <AnimatePresence>
        {gameState.feedback && (
          <motion.div className="fixed bottom-10 text-2xl font-bold">
            {gameState.feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GridCell({ cell }) {
  return (
    <div className="w-24 h-24 flex items-center justify-center bg-gray-800 rounded-xl text-3xl">
      {cell}
    </div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs">{label}</span>
      <span className={`text-2xl ${color}`}>{value}</span>
    </div>
  );
}
