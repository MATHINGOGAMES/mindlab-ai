"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { generateSudoku } from "./sudokuEngine";
import { useGameStore } from "@/core/store";
import { playSound } from "@/core/sounds";
import ResultModal from "@/components/shared/ResultModal";

export default function Sudoku() {
  const navigate = useNavigate();

  // --- States ---
  const [difficulty, setDifficulty] = useState("medium");
  const [game, setGame] = useState(() => generateSudoku("medium"));
  const [grid, setGrid] = useState(game.puzzle);
  const [initialGrid, setInitialGrid] = useState(game.puzzle);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);
  const [win, setWin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null); // {row, col}

  const addXP = useGameStore((state) => state.addXP);

  // --- Timer ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (!win && lives > 0) setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [win, lives]);

  // --- Handlers ---
  const handleNewGame = (diff = difficulty) => {
    const newGame = generateSudoku(diff);
    setGame(newGame);
    setGrid(newGame.puzzle);
    setInitialGrid(newGame.puzzle);
    setDifficulty(diff);
    setTime(0);
    setLives(3);
    setWin(false);
    setIsModalOpen(false);
    setSelectedCell(null);
  };

  const handleChange = (row, col, value) => {
    if (initialGrid[row][col] !== "" || win || lives <= 0) return;
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = value === "" ? "" : Number(value);

    if (value !== "") {
      if (Number(value) !== game.solution[row][col]) {
        setLives((l) => l - 1);
        playSound("wrong");
        if (lives <= 1) setIsModalOpen(true);
      } else {
        playSound("correct");
        checkWin(newGrid);
      }
    }
    setGrid(newGrid);
  };

  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    handleChange(row, col, num === "erase" ? "" : num);
  };

  const checkWin = (currentGrid) => {
    const isComplete = currentGrid.every((row, i) =>
      row.every((cell, j) => cell !== "" && cell === game.solution[i][j])
    );
    if (isComplete) {
      setWin(true);
      playSound("win");
      addXP(100 + (difficulty === "hard" ? 100 : 50));
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 pt-12 font-sans">
      {/* 🟢 العدادات العلوية */}
      <div className="mb-8 flex gap-8 text-white bg-[#111111]/90 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-[#00d2ff]/20 shadow-2xl">
        <div className="text-center px-4">
          <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
            Timer
          </p>
          <p className="text-2xl font-black text-cyan-400">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
          </p>
        </div>
        <div className="w-[1px] bg-white/10 my-2" />
        <div className="text-center px-4">
          <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
            Stability
          </p>
          <p className="text-2xl tracking-[2px]">{"❤️".repeat(lives)}</p>
        </div>
      </div>

      {/* 🟢 شبكة السودوكو + لوحة الأرقام */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 🔹 شبكة السودوكو */}
        <div className="grid grid-cols-9 grid-rows-9 gap-0 bg-[#121212] p-2 rounded-3xl shadow-[0_0_60px_rgba(0,210,255,0.4)] border-[8px] border-[#00d2ff]/30">
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const isInitial = initialGrid[i][j] !== "";
              const isSelected =
                selectedCell?.row === i && selectedCell?.col === j;

              const borderTop =
                i % 3 === 0
                  ? "border-t-4 border-t-[#00d2ff]/50"
                  : "border-t border-t-[#00d2ff]/20";
              const borderLeft =
                j % 3 === 0
                  ? "border-l-4 border-l-[#00d2ff]/50"
                  : "border-l border-l-[#00d2ff]/20";
              const borderRight =
                (j + 1) % 3 === 0
                  ? "border-r-4 border-r-[#00d2ff]/50"
                  : "border-r border-r-[#00d2ff]/20";
              const borderBottom =
                (i + 1) % 3 === 0
                  ? "border-b-4 border-b-[#00d2ff]/50"
                  : "border-b border-b-[#00d2ff]/20";

              return (
                <div
                  key={`${i}-${j}`}
                  onClick={() =>
                    !isInitial && setSelectedCell({ row: i, col: j })
                  }
                  className={`
                    w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-black cursor-pointer transition-all duration-75
                    ${borderTop} ${borderLeft} ${borderRight} ${borderBottom}
                    ${
                      isInitial
                        ? "bg-[#1f1f1f] text-white"
                        : "bg-[#0f0f0f] text-cyan-400"
                    }
                    ${
                      isSelected
                        ? "bg-cyan-500/20 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] z-10 scale-105"
                        : ""
                    }
                    ${!isInitial && !isSelected ? "hover:bg-[#1a1a1a]/70" : ""}
                  `}
                >
                  {cell}
                </div>
              );
            })
          )}
        </div>

        {/* 🔹 لوحة الأرقام والشرح */}
        <div className="flex flex-col gap-6 bg-[#111111]/80 p-6 rounded-[2.5rem] border border-[#00d2ff]/20 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.05, backgroundColor: "#0f0f0f" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNumberInput(num)}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-[#121212] border border-[#00d2ff]/30 rounded-2xl text-2xl font-black text-cyan-400 shadow-xl flex items-center justify-center hover:border-cyan-400 transition-all active:bg-cyan-600"
              >
                {num}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNumberInput("erase")}
              className="col-span-3 h-14 bg-red-600/20 border border-red-500/40 rounded-2xl text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
            >
              Clear ⌫
            </motion.button>
          </div>

          {/* التحكم في الصعوبة */}
          <div className="flex flex-col gap-3 border-t border-[#00d2ff]/20 pt-6">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center">
              Complexity Level
            </p>
            <div className="flex gap-2">
              {["easy", "medium", "hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => handleNewGame(d)}
                  className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                    difficulty === d
                      ? "bg-cyan-500 text-black"
                      : "bg-[#121212] text-zinc-400 hover:text-cyan-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* شرح أسفل لوحة الأرقام */}
          <p className="text-[10px] text-zinc-400 mt-4 text-center">
            Select a number and click on a cell to fill it. Use "Clear" to erase
            a cell. Complete all cells to win!
          </p>
        </div>
      </div>

      {/* مودال النتائج */}
      <ResultModal
        isOpen={isModalOpen}
        status={win ? "win" : "lose"}
        score={win ? (difficulty === "hard" ? 500 : 200) : 0}
        time={`${Math.floor(time / 60)}m`}
        onRestart={() => handleNewGame()}
        nextLevel={() => navigate("/")}
      />
    </div>
  );
}
