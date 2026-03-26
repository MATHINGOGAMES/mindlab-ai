import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { generateSudoku } from "./sudokuEngine";
import { useGameStore } from "../../core/store";

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

  // 🔊 Sounds
  const playSound = (type) => {
    const sounds = {
      correct: new Audio("/sounds/correct.mp3"),
      wrong: new Audio("/sounds/wrong.mp3"),
      win: new Audio("/sounds/win.mp3"),
    };
    sounds[type]?.play();
  };

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // 🎯 New Game
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

  // ✏️ Input
  const handleChange = (row, col, value) => {
    if (initialGrid[row][col] !== "") return;
    if (!/^[1-9]?$/.test(value)) return;

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = value === "" ? "" : Number(value);

    if (value !== "" && Number(value) !== solution[row][col]) {
      setLives((l) => l - 1);
      setShake(true);
      playSound("wrong");
      setTimeout(() => setShake(false), 300);
    } else if (value !== "") {
      playSound("correct");
    }

    setGrid(newGrid);
  };

  // 💡 Hint
  const handleHint = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === "") {
          const newGrid = grid.map((r) => [...r]);
          newGrid[i][j] = solution[i][j];
          setGrid(newGrid);
          playSound("correct");
          return;
        }
      }
    }
  };

  // ❌ check
  const isWrong = (i, j) => {
    return grid[i][j] !== "" && Number(grid[i][j]) !== solution[i][j];
  };

  // 🧠 win
  const checkWin = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (Number(grid[i][j]) !== solution[i][j]) return false;
      }
    }
    return true;
  };

  const handleWin = () => {
    if (checkWin()) {
      addXP(120);
      setWin(true);
      playSound("win");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  // 💀 Game Over
  useEffect(() => {
    if (lives <= 0) {
      alert("💀 Game Over!");
      handleNewGame();
    }
  }, [lives]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>🧩 Sudoku</h2>

      <div style={{ marginBottom: 10 }}>
        ⏱ {formatTime()} | ❤️ {lives}
      </div>

      {/* 🎉 Win Animation */}
      {win && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            background: "#0f0",
            padding: 10,
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
          🎉 You Win!
        </motion.div>
      )}

      {/* 🎯 Difficulty */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => handleNewGame("easy")}>Easy</button>
        <button onClick={() => handleNewGame("medium")}>Medium</button>
        <button onClick={() => handleNewGame("hard")}>Hard</button>
      </div>

      {/* 🧩 Grid */}
      <motion.div
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 45px)",
          justifyContent: "center",
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => {
            const fixed = initialGrid[i][j] !== "";
            const wrong = isWrong(i, j);

            return (
              <motion.input
                whileTap={{ scale: 0.9 }}
                key={i + "-" + j}
                value={cell}
                disabled={fixed}
                onChange={(e) => handleChange(i, j, e.target.value)}
                style={{
                  width: 45,
                  height: 45,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: fixed ? "bold" : "normal",
                  background: fixed ? "#eee" : wrong ? "#ffcccc" : "#fff",
                  borderRight:
                    (j + 1) % 3 === 0 ? "3px solid black" : "1px solid #999",
                  borderBottom:
                    (i + 1) % 3 === 0 ? "3px solid black" : "1px solid #999",
                  borderTop: i === 0 ? "3px solid black" : "",
                  borderLeft: j === 0 ? "3px solid black" : "",
                }}
              />
            );
          })
        )}
      </motion.div>

      {/* 🎮 Controls */}
      <div style={{ marginTop: 20 }}>
        <button onClick={handleHint}>💡 Hint</button>
        <button onClick={handleWin}>Check</button>
        <button onClick={() => handleNewGame()}>🔄 New Game</button>
      </div>
    </div>
  );
}
