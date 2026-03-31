import React, { useRef, useEffect, useState } from "react";

const WORD_SETS = [
  {
    base: "FIRE",
    correct: ["FLY", "MAN", "WORK"],
    wrong: ["WATER", "ICE", "STONE"],
  },
  {
    base: "SUN",
    correct: ["LIGHT", "RISE"],
    wrong: ["COLD", "DARK", "NIGHT"],
  },
];

const playSound = (type) => {
  const audio = new Audio(`/sounds/${type}.mp3`);
  audio.volume = 0.4;
  audio.play();
};

const WordCatcher = () => {
  const canvasRef = useRef(null);

  const [gameState, setGameState] = useState("START");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [setIndex, setSetIndex] = useState(0);

  const canvasWidth = 800;
  const canvasHeight = 500;
  const basketWidth = 120;

  const basketX = useRef(canvasWidth / 2 - 60);
  const words = useRef([]);

  const currentSet = WORD_SETS[setIndex];

  // 🎯 توليد الكلمات
  const generateWords = () => {
    const allWords = [
      ...currentSet.correct.map((w) => ({ text: w, isCorrect: true })),
      ...currentSet.wrong.map((w) => ({ text: w, isCorrect: false })),
    ];

    words.current = allWords.map((w, i) => ({
      id: i,
      text: w.text,
      x: Math.random() * (canvasWidth - 100),
      y: -Math.random() * 500,
      speed: 2 + level * 0.3,
      isCorrect: w.isCorrect,
      color: w.isCorrect ? "#00ffcc" : "#ff0055",
    }));
  };

  // 🧠 Advice System
  const getAdvice = () => {
    if (streak >= 5) return "🔥 You're unstoppable!";
    if (streak >= 3) return "Great focus!";
    if (score < 20) return "Focus on correct words!";
    return "You're improving fast!";
  };

  // ⏱️ Timer
  useEffect(() => {
    let timer;
    if (gameState === "PLAYING" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState("GAMEOVER");
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleMouseMove = (e) => {
      if (gameState !== "PLAYING") return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      basketX.current = Math.max(
        0,
        Math.min(mouseX - basketWidth / 2, canvasWidth - basketWidth)
      );
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (gameState === "PLAYING") {
        // 🟦 Basket
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00f2ff";
        ctx.fillStyle = "#00f2ff";
        ctx.fillRect(basketX.current, canvasHeight - 40, basketWidth, 15);

        words.current.forEach((word) => {
          word.y += word.speed;

          ctx.shadowBlur = 25;
          ctx.shadowColor = word.color;
          ctx.strokeStyle = word.color;
          ctx.strokeRect(word.x, word.y, 90, 40);

          ctx.fillStyle = "#fff";
          ctx.font = "bold 18px Arial";
          ctx.textAlign = "center";
          ctx.fillText(word.text, word.x + 45, word.y + 25);

          // 💥 Collision
          if (
            word.y + 40 >= canvasHeight - 40 &&
            word.x + 90 >= basketX.current &&
            word.x <= basketX.current + basketWidth
          ) {
            if (word.isCorrect) {
              setScore((s) => s + 10 + streak * 2);
              setStreak((s) => s + 1);
              setLevel((l) => l + 1);
              playSound("correct");
            } else {
              setScore((s) => Math.max(0, s - 5));
              setStreak(0);
              playSound("wrong");
            }
            resetWord(word);
          }

          if (word.y > canvasHeight) resetWord(word);
        });
      }

      if (gameState !== "GAMEOVER") requestAnimationFrame(animate);
    };

    const resetWord = (word) => {
      word.y = -60;
      word.x = Math.random() * (canvasWidth - 100);
    };

    const id = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(id);
    };
  }, [gameState, level, streak]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setStreak(0);
    setTimeLeft(30);
    generateWords();
    setGameState("PLAYING");
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>WORD CATCHER PRO</h1>

      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={canvasStyle}
        />

        {gameState === "START" && (
          <div style={overlayStyle}>
            <h2>Mission</h2>
            <p>Catch words related to "{currentSet.base}"</p>
            <button onClick={startGame} style={buttonStyle}>
              START
            </button>
          </div>
        )}

        {gameState === "GAMEOVER" && (
          <div style={overlayStyle}>
            <h2>Game Over</h2>
            <p>Score: {score}</p>
            <button onClick={startGame} style={buttonStyle}>
              PLAY AGAIN
            </button>
          </div>
        )}

        {gameState === "PLAYING" && (
          <>
            <div style={hudStyle}>
              <span>⏱ {timeLeft}s</span>
              <span>⭐ {score}</span>
              <span>🔥 {streak}</span>
              <span>🧠 Lv.{level}</span>
            </div>

            <div style={adviceStyle}>{getAdvice()}</div>
          </>
        )}
      </div>
    </div>
  );
};

// 🎨 Styles
const containerStyle = {
  textAlign: "center",
  background: "#050505",
  color: "#fff",
  minHeight: "100vh",
};

const titleStyle = {
  fontSize: "2.5rem",
  textShadow: "0 0 15px cyan",
};

const canvasStyle = {
  borderRadius: "15px",
  border: "2px solid #333",
};

const overlayStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const buttonStyle = {
  padding: "15px 40px",
  fontSize: "1.2rem",
  background: "#00f2ff",
  border: "none",
  borderRadius: "30px",
  cursor: "pointer",
};

const hudStyle = {
  position: "absolute",
  top: "10px",
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
};

const adviceStyle = {
  position: "absolute",
  bottom: "10px",
  width: "100%",
  textAlign: "center",
  color: "#00f2ff",
};

export default WordCatcher;
