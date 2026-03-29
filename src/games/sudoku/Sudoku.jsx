"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";
import { playSound } from "../../core/sounds";
import { useGameStore } from "../../core/store";

import { generateSudoku, generateDailySudoku } from "./sudokuEngine";

// ========================
// 🧠 Description
// ========================

const SUDOKU_DESCRIPTION = `
🧩 Sudoku Master – Description

Sudoku Master is a classic logic puzzle game enhanced with modern AI features, designed to challenge your brain and improve your logical thinking skills. Players must fill a 9×9 grid so that each row, column, and 3×3 section contains numbers from 1 to 9 without repetition.

As difficulty increases, puzzles become more complex, requiring deeper concentration, strategic thinking, and advanced problem-solving abilities. With AI-generated puzzles and daily challenges, every game offers a fresh and engaging experience.

🎯 Why It Matters (Benefits)

Playing Sudoku regularly can significantly improve:

Focus & Concentration  
Enhances your ability to stay focused for extended periods.

Logical Thinking  
Develops structured reasoning and decision-making skills.

Memory Retention  
Strengthens short-term memory through number tracking.

Problem-Solving Skills  
Encourages analytical thinking and pattern recognition.

Mental Agility  
Keeps your brain sharp, active, and adaptive.

🚀 The Experience

With AI-generated levels, adaptive difficulty, and daily puzzles, Sudoku Master delivers a modern brain-training experience. Whether you're a beginner or an expert, this game offers endless challenges to sharpen your mind and boost your cognitive performance.
`;

// ========================
// 🎮 Component
// ========================

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState("medium");
  const [{ puzzle, solution }, setGame] = useState(() =>
    generateSudoku("medium")
  );

  const [grid, setGrid] = useState(puzzle);
  const [initialGrid, setInitialGrid] = useState(puzzle);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);
  const [win, setWin] = useState(false);
  const [shake, setShake] = useState(false);
  const [score, setScore] = useState(0);
  const [modal, setModal] = useState(false);

  const addXP = useGameStore((s) => s.addXP);

  // ⏱ Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!win && lives > 0) setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [win, lives]);

  // ✅ Win check
  useEffect(() => {
    const done = grid.every((row, i) =>
      row.every((cell, j) => cell !== "" && Number(cell) === solution[i][j])
    );

    if (done && !win) {
      setWin(true);
      playSound("win");

      const finalScore = Math.max(0, 1000 - time * 2 + lives * 50);
      setScore(finalScore);
      addXP(100);
      setModal(true);
    }
  }, [grid]);

  const newGame = (diff = difficulty) => {
    const game = generateSudoku(diff);
    setGame(game);
    setGrid(game.puzzle);
    setInitialGrid(game.puzzle);
    setDifficulty(diff);
    setTime(0);
    setLives(3);
    setWin(false);
    setModal(false);
  };

  const dailyGame = () => {
    const game = generateDailySudoku(difficulty);
    setGame(game);
    setGrid(game.puzzle);
    setInitialGrid(game.puzzle);
    setTime(0);
    setLives(3);
    setWin(false);
    setModal(false);
  };

  const handleInput = (r, c, val) => {
    if (initialGrid[r][c] !== "" || win) return;
    if (!/^[1-9]?$/.test(val)) return;

    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = val === "" ? "" : Number(val);

    if (val !== "" && Number(val) !== solution[r][c]) {
      setLives((l) => l - 1);
      setShake(true);
      playSound("wrong");
      setTimeout(() => setShake(false), 300);
    }

    setGrid(newGrid);
  };

  return (
    <>
      <Helmet>
        <title>Sudoku Master | AI Brain Game</title>
        <meta name="description" content={SUDOKU_DESCRIPTION} />
      </Helmet>

      <div className="p-6 text-white bg-black min-h-screen flex flex-col items-center">
        <h1 className="text-4xl font-black mb-6">🧩 Sudoku Master</h1>

        {/* Buttons */}
        <div className="flex gap-2 mb-6">
          {["easy", "medium", "hard"].map((d) => (
            <button key={d} onClick={() => newGame(d)}>
              {d}
            </button>
          ))}
          <button onClick={dailyGame}>🌞 Daily</button>
        </div>

        {/* Grid */}
        <motion.div
          animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
          className="grid grid-cols-9 bg-zinc-800 p-[3px] rounded-xl shadow-2xl overflow-hidden"
        >
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const isInitial = initialGrid[i][j] !== "";

              // ✅ حدود سميكة كل 3 خلايا
              const thickRight = (j + 1) % 3 === 0 && j !== 8;
              const thickBottom = (i + 1) % 3 === 0 && i !== 8;

              return (
                <input
                  key={`${i}-${j}`}
                  value={cell}
                  disabled={isInitial || win}
                  onChange={(e) => handleInput(i, j, e.target.value)}
                  maxLength="1"
                  className={`
            w-10 h-10 sm:w-12 sm:h-12
            text-center text-lg font-bold
            outline-none

            border border-gray-400

            ${thickRight ? "border-r-4 border-r-black" : ""}
            ${thickBottom ? "border-b-4 border-b-black" : ""}

            ${
              isInitial
                ? "bg-gray-200 text-black font-extrabold"
                : "bg-white text-blue-600"
            }

            focus:bg-blue-100
          `}
                />
              );
            })
          )}
        </motion.div>

        {/* Description */}
        <div className="mt-10 max-w-2xl text-sm text-gray-300 whitespace-pre-line">
          {SUDOKU_DESCRIPTION}
        </div>

        {/* Modal */}
        <ResultModal
          isOpen={modal}
          status={win ? "win" : "lose"}
          score={score}
          time={time}
          onRestart={() => newGame()}
        />
      </div>
    </>
  );
}
