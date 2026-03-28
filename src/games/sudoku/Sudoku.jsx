import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { generateSudoku } from "./sudokuEngine";
import { useGameStore } from "../../core/store";
// 1. استيراد نظام الأصوات
import { playSound } from "../../core/sounds";

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState("medium");

  const createGame = (diff) => {
    const { puzzle, solution } = generateSudoku(diff);
    return { puzzle, solution };
  };

  const [{ puzzle, solution }, setGame] = useState(() => createGame("medium"));
  const [grid, setGrid] = useState(puzzle);
  const [initialGrid, setInitialGrid] = useState(puzzle);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);
  const [shake, setShake] = useState(false);
  const [win, setWin] = useState(false);

  const addXP = useGameStore((s) => s.addXP);

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!win) setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [win]);

  // 2. التحقق من الفوز وتشغيل صوت الفوز
  useEffect(() => {
    const isComplete = grid.every((row, i) =>
      row.every((cell, j) => cell !== "" && Number(cell) === solution[i][j])
    );

    if (isComplete && !win && grid[0][0] !== "") {
      setWin(true);
      playSound("win"); // صوت الفوز
      addXP(100);
    }
  }, [grid, solution, win, addXP]);

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleNewGame = (diff = difficulty) => {
    const newGame = createGame(diff);
    setGame(newGame);
    setGrid(newGame.puzzle);
    setInitialGrid(newGame.puzzle);
    setDifficulty(diff);
    setTime(0);
    setLives(3);
    setWin(false);
  };

  const handleChange = (row, col, value) => {
    if (initialGrid[row][col] !== "") return;
    if (!/^[1-9]?$/.test(value)) return;

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = value === "" ? "" : Number(value);

    // 3. تشغيل الأصوات عند الإدخال
    if (value !== "") {
      if (Number(value) !== solution[row][col]) {
        // إجابة خاطئة
        setLives((l) => l - 1);
        setShake(true);
        playSound("wrong"); // صوت الخطأ
        setTimeout(() => setShake(false), 300);
      } else {
        // إجابة صحيحة
        playSound("correct"); // صوت الإجابة الصحيحة
      }
    }

    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-white bg-black min-h-screen">
      <h2 className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        🧩 SUDOKU MASTER
      </h2>

      {/* Stats Area */}
      <div className="flex gap-8 mb-6 bg-gray-900/50 p-4 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase opacity-50">Time</span>
          <span className="text-2xl font-mono text-blue-400">
            {formatTime()}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase opacity-50">Lives</span>
          <span className="text-2xl font-mono text-red-500">
            {"❤️ ".repeat(Math.max(0, lives))}
          </span>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex gap-2 mb-8">
        {["easy", "medium", "hard"].map((diff) => (
          <button
            key={diff}
            onClick={() => handleNewGame(diff)}
            className={`px-4 py-2 rounded-xl uppercase text-xs font-bold transition-all ${
              difficulty === diff
                ? "bg-green-600 text-white scale-110 shadow-lg shadow-green-900/50"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* The Grid */}
      <motion.div
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        className="grid grid-cols-9 gap-0 bg-gray-300 p-1 rounded-lg shadow-2xl overflow-hidden border-4 border-gray-900"
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const isInitial = initialGrid[i][j] !== "";
            const isWrong = cell !== "" && Number(cell) !== solution[i][j];

            return (
              <input
                key={`${i}-${j}`}
                value={cell}
                disabled={isInitial || win}
                onChange={(e) => handleChange(i, j, e.target.value)}
                maxLength="1"
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-bold outline-none transition-all
                  /* حدود المربعات الكبرى */
                  ${
                    (j + 1) % 3 === 0 && j < 8
                      ? "border-r-2 border-gray-900"
                      : "border-r border-gray-400"
                  }
                  ${
                    (i + 1) % 3 === 0 && i < 8
                      ? "border-b-2 border-gray-900"
                      : "border-b border-gray-400"
                  }
                  /* الألوان */
                  ${
                    isInitial
                      ? "bg-gray-200 text-gray-900"
                      : "bg-white text-blue-600 focus:bg-blue-50"
                  }
                  ${isWrong ? "bg-red-100 text-red-600 focus:bg-red-200" : ""}
                `}
              />
            );
          })
        )}
      </motion.div>

      {/* Game Controls */}
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => handleNewGame()}
          className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
        >
          🔄 RESET
        </button>
        {win && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400 font-bold text-xl"
          >
            🏆 Perfect!
          </motion.div>
        )}
      </div>
    </div>
  );
}
