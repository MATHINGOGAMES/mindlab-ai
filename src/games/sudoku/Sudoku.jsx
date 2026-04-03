"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { generateSudoku } from "./sudokuEngine";
import { useGameStore } from "../../core/store";
import { playSound } from "../../core/sounds";

export default function Sudoku() {
  const navigate = useNavigate();
  const { addXP, rank, level } = useGameStore();

  // --- States ---
  const [difficulty, setDifficulty] = useState("medium");
  const [game, setGame] = useState(() => generateSudoku("medium"));
  const [grid, setGrid] = useState(game.puzzle);
  const [initialGrid, setInitialGrid] = useState(game.puzzle);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);
  const [win, setWin] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [errorCell, setErrorCell] = useState(null);

  // --- Timer ---
  useEffect(() => {
    let interval;
    if (!win && lives > 0) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [win, lives]);

  // --- Core Handlers ---
  const handleCellClick = (row, col) => {
    if (initialGrid[row][col] === "" && !win && lives > 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num) => {
    if (!selectedCell || win || lives <= 0) return;
    const { row, col } = selectedCell;

    if (num === game.solution[row][col]) {
      // ✅ Correct Input - Trigger Sound
      playSound("correct");
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = num;
      setGrid(newGrid);
      checkWin(newGrid);
    } else {
      // ❌ Error Input - Trigger Sound & Penalty
      playSound("wrong");
      setLives((l) => l - 1);
      setErrorCell({ row, col });
      setTimeout(() => setErrorCell(null), 500);
    }
  };

  const checkWin = (currentGrid) => {
    const isComplete = currentGrid.every((row, i) =>
      row.every((cell, j) => cell !== "" && cell === game.solution[i][j])
    );

    if (isComplete) {
      setWin(true);
      playSound("win"); // 🏆 Win Sound

      // Calculate Professional XP
      const baseXP = 50;
      const difficultyMulti =
        difficulty === "hard" ? 2 : difficulty === "medium" ? 1.5 : 1;
      const accuracyBonus = lives * 10;
      const totalXP = Math.floor(baseXP * difficultyMulti + accuracyBonus);

      addXP(totalXP);
    }
  };

  const resetGame = (newDiff = difficulty) => {
    const newGame = generateSudoku(newDiff);
    setGame(newGame);
    setGrid(newGame.puzzle);
    setInitialGrid(newGame.puzzle);
    setDifficulty(newDiff);
    setTime(0);
    setLives(3);
    setWin(false);
    setSelectedCell(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pt-24 font-mono selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto">
        {/* --- Global Status Header --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-between items-center mb-8 bg-[#0c0c0c] p-6 rounded-3xl border border-white/5 gap-4 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-2xl border border-cyan-500/20">
              🧩
            </div>
            <div>
              <p className="text-[10px] text-cyan-500 tracking-[0.3em] uppercase">
                Sector: Sudoku_Lab
              </p>
              <h2 className="text-xl font-black">
                {rank.replace("_", " ")}{" "}
                <span className="text-zinc-600 text-xs tracking-normal">
                  LVL {level}
                </span>
              </h2>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 uppercase mb-1 tracking-widest">
              Process Time
            </p>
            <p className="text-3xl font-black text-cyan-400 tabular-nums">
              {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-red-500 uppercase mb-1 tracking-widest font-bold">
              Neural Integrity
            </p>
            <div className="flex gap-2 justify-end">
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    scale: i < lives ? 1 : 0.8,
                    opacity: i < lives ? 1 : 0.2,
                  }}
                  className="text-2xl text-red-500"
                >
                  ⚡
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* --- Primary Interaction Zone --- */}
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center mb-20">
          {/* Professional Sudoku Grid */}
          <div className="relative p-2 bg-[#0c0c0c] rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)]">
            <div className="grid grid-cols-9 border-4 border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              {grid.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => handleCellClick(i, j)}
                    className={`
                      w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-xl font-bold transition-all cursor-pointer relative
                      ${
                        i % 3 === 2 && i !== 8
                          ? "border-b-4 border-zinc-800"
                          : "border-b border-white/5"
                      }
                      ${
                        j % 3 === 2 && j !== 8
                          ? "border-r-4 border-zinc-800"
                          : "border-r border-white/5"
                      }
                      ${
                        initialGrid[i][j] !== ""
                          ? "text-zinc-600 bg-zinc-900/40"
                          : "text-cyan-400 bg-black"
                      }
                      ${
                        selectedCell?.row === i && selectedCell?.col === j
                          ? "bg-cyan-500/20 text-white z-10"
                          : ""
                      }
                      ${
                        errorCell?.row === i && errorCell?.col === j
                          ? "bg-red-900/60 text-white animate-pulse"
                          : ""
                      }
                    `}
                  >
                    {cell}
                    {selectedCell?.row === i && selectedCell?.col === j && (
                      <motion.div
                        layoutId="glow"
                        className="absolute inset-0 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-20 pointer-events-none"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Neural Input Interface */}
          <div className="w-full max-w-[320px]">
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#111" }}
                  whileTap={{ scale: 0.95 }}
                  key={n}
                  onClick={() => handleNumberInput(n)}
                  className="h-16 bg-[#0c0c0c] border border-white/10 rounded-2xl font-black text-2xl hover:border-cyan-500/50 hover:text-cyan-400 transition-all shadow-lg"
                >
                  {n}
                </motion.button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                {["easy", "medium", "hard"].map((d) => (
                  <button
                    key={d}
                    onClick={() => resetGame(d)}
                    className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg border transition-all ${
                      difficulty === d
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                        : "border-white/5 text-zinc-600 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full py-4 text-[10px] tracking-[0.3em] text-zinc-600 border border-white/5 rounded-2xl hover:bg-red-950/20 hover:text-red-500 hover:border-red-500/30 transition-all uppercase font-bold"
              >
                Abort Connection
              </button>
            </div>
          </div>
        </div>

        {/* --- Professional SEO Footer --- */}
        <footer className="mt-24 border-t border-white/5 pt-16 pb-20 font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 text-zinc-400">
            <div>
              <h2 className="text-2xl font-black text-white mb-6 tracking-tight">
                The Ultimate AI Sudoku Experience
              </h2>
              <p className="leading-relaxed mb-6 text-lg">
                Welcome to{" "}
                <span className="text-cyan-500 font-bold">MindLab AI</span>,
                where logic meets the future. Our Sudoku Master module is more
                than just a puzzle—it is a specialized cognitive training
                environment.
              </p>
              <p className="leading-relaxed mb-6">
                Powered by a **procedural grid generator**, our engine creates
                billions of unique mathematical combinations. Playing Sudoku
                regularly is scientifically proven to improve neuroplasticity
                and short-term memory.
              </p>
            </div>

            <div className="bg-[#0c0c0c] p-8 rounded-[2.5rem] border border-white/5 relative">
              <h3 className="text-cyan-500 font-bold uppercase tracking-widest text-sm mb-6">
                Module Features
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="text-cyan-500 font-bold">01.</span>
                  <div>
                    <p className="text-white font-bold text-sm">
                      Global Progression Sync
                    </p>
                    <p className="text-xs mt-1 leading-relaxed">
                      Earn XP across all MindLab modules. Your performance here
                      directly affects your Global Rank.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-cyan-500 font-bold">02.</span>
                  <div>
                    <p className="text-white font-bold text-sm">
                      Neural Integrity System
                    </p>
                    <p className="text-xs mt-1 leading-relaxed">
                      Three lives per session. High accuracy is rewarded with
                      massive XP multipliers.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-cyan-500 font-bold">03.</span>
                  <div>
                    <p className="text-white font-bold text-sm">
                      Dynamic AI Difficulty
                    </p>
                    <p className="text-xs mt-1 leading-relaxed">
                      From Initiate to MindLab Master, grids adapt to your
                      cognitive threshold.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </footer>

        {/* Success Overlay */}
        <AnimatePresence>
          {win && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <h2 className="text-8xl font-black text-cyan-500 mb-4 tracking-tighter drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                  SUCCESS
                </h2>
                <p className="text-zinc-500 tracking-[1em] mb-12 uppercase text-sm font-bold">
                  Neural Data Synchronized
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-16 py-5 bg-cyan-600 text-black font-black rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                >
                  RETURN TO DASHBOARD
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
