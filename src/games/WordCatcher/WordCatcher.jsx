"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../core/store";
import { playSound } from "../../core/sounds";

// بنك الكلمات الموسع (يمكنك إضافة المزيد هنا)
const WORD_BANK = {
  SPACE: [
    "STAR",
    "MOON",
    "ORBIT",
    "MARS",
    "VOID",
    "SUN",
    "GALAXY",
    "COMET",
    "ALIEN",
    "NEBULA",
    "ROCKET",
    "PLANET",
  ],
  BRAIN: [
    "MIND",
    "THINK",
    "LEARN",
    "FOCUS",
    "MEMORY",
    "SMART",
    "IDEA",
    "LOGIC",
    "NERVE",
    "IQ",
    "SENSE",
    "DREAM",
  ],
  CODING: [
    "REACT",
    "NODE",
    "VITE",
    "ARRAY",
    "LOGIC",
    "LOOP",
    "CODE",
    "DATA",
    "BYTE",
    "CHIP",
    "CSS",
    "HTML",
  ],
  NATURE: [
    "TREE",
    "LEAF",
    "RAIN",
    "WIND",
    "SEA",
    "ROCK",
    "BIRD",
    "FISH",
    "FIRE",
    "WOOD",
    "FLOWER",
    "RIVER",
  ],
};

const WordCatcherProPlus = () => {
  const { addXP, rank, level } = useGameStore();
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const basketX = useRef(325);
  const fallingWords = useRef([]);
  const feedbackColor = useRef(null); // للتغذية الراجعة اللحظية عند التصادم

  const [gameState, setGameState] = useState("START");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [target, setTarget] = useState("");
  const [stage, setStage] = useState(1);

  const config = {
    width: 800,
    height: 580,
    basketWidth: 150,
    columns: 6,
    wordWidth: 110,
    wordHeight: 40,
  };

  // --- نظام التحكم (ماوس + لمس) ---
  useEffect(() => {
    const handleMove = (e) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const scaleX = config.width / rect.width;
      const x = (clientX - rect.left) * scaleX;
      basketX.current = Math.max(
        0,
        Math.min(x - config.basketWidth / 2, config.width - config.basketWidth)
      );
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  const generateLevel = useCallback(
    (category) => {
      const correct = WORD_BANK[category] || [];
      const others = Object.keys(WORD_BANK)
        .filter((k) => k !== category)
        .flatMap((k) => WORD_BANK[k]);

      const pool = [
        ...correct
          .sort(() => 0.5 - Math.random())
          .slice(0, 8)
          .map((t) => ({ text: t, isCorrect: true })),
        ...[...new Set(others)]
          .sort(() => 0.5 - Math.random())
          .slice(0, 8)
          .map((t) => ({ text: t, isCorrect: false })),
      ].sort(() => 0.5 - Math.random());

      const colWidth = config.width / config.columns;
      fallingWords.current = pool.map((w, index) => ({
        ...w,
        x:
          (index % config.columns) * colWidth +
          (colWidth - config.wordWidth) / 2,
        y: -((index + 1) * 160),
        speed: 2.2 + stage * 0.3,
      }));
    },
    [stage]
  );

  const update = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, config.width, config.height);

    // --- Insane Mode Speed Logic ---
    const speedMultiplier = 1 + score / 500;

    // --- Draw Basket ---
    ctx.shadowBlur = 20;
    // يتغير لون السلة لحظياً عند التقاط كلمة (أخضر للصح، أحمر للخطأ)
    ctx.shadowColor = feedbackColor.current || "#06b6d4";
    ctx.fillStyle = feedbackColor.current || "#06b6d4";
    ctx.beginPath();
    ctx.roundRect(
      basketX.current,
      config.height - 50,
      config.basketWidth,
      14,
      10
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // --- Draw Words (The Neutral Design) ---
    fallingWords.current.forEach((word) => {
      word.y += word.speed * speedMultiplier;

      // إطار موحد تماماً - لا أخضر ولا أحمر هنا (إجبار على القراءة)
      ctx.fillStyle = "rgba(15, 15, 15, 0.95)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(word.x, word.y, config.wordWidth, config.wordHeight, 8);
      ctx.fill();
      ctx.stroke();

      // النص الأبيض الواضح
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(word.text, word.x + config.wordWidth / 2, word.y + 25);

      // --- Collision Detection ---
      if (
        word.y > config.height - 75 &&
        word.y < config.height - 20 &&
        word.x + config.wordWidth > basketX.current &&
        word.x < basketX.current + config.basketWidth
      ) {
        if (word.isCorrect) {
          setScore((s) => s + 20 * Math.floor(speedMultiplier));
          playSound("correct");
          feedbackColor.current = "#22c55e"; // ومضة خضراء
        } else {
          setScore((s) => Math.max(0, s - 25));
          playSound("wrong");
          feedbackColor.current = "#ef4444"; // ومضة حمراء
        }

        // إعادة تعيين اللون بعد 150 مللي ثانية
        setTimeout(() => (feedbackColor.current = null), 150);

        word.y = -200 - Math.random() * 600;
      }

      if (word.y > config.height) {
        word.y = -200 - Math.random() * 800;
        word.x = Math.random() * (config.width - config.wordWidth);
      }
    });

    if (gameState === "PLAYING")
      requestRef.current = requestAnimationFrame(update);
  }, [gameState, score]);

  useEffect(() => {
    if (gameState === "PLAYING")
      requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, update]);

  const startGame = () => {
    const keys = Object.keys(WORD_BANK);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setTarget(randomKey);
    generateLevel(randomKey);
    setScore(0);
    setTimeLeft(40);
    setGameState("PLAYING");
  };

  useEffect(() => {
    if (gameState === "PLAYING" && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (timeLeft === 0 && gameState === "PLAYING") {
      setGameState("GAMEOVER");
      addXP(Math.floor(score / 4));
      playSound("win");
    }
  }, [gameState, timeLeft, score]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 pt-24 font-mono">
      <div className="max-w-5xl mx-auto">
        {/* Header HUD */}
        <div className="flex justify-between items-center mb-8 bg-[#0c0c0c] p-6 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🧩</div>
            <div>
              <p className="text-[10px] text-cyan-500 tracking-[0.3em] uppercase">
                MindLab Protocol
              </p>
              <h2 className="text-xl font-black">
                RANK: {rank.replace("_", " ")}
              </h2>
            </div>
          </div>
          <div className="text-center px-10 py-2 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] text-zinc-500 uppercase">
              Target Sequence
            </p>
            <p className="text-2xl font-black text-cyan-400 italic tracking-tighter">
              {target || "READY?"}
            </p>
          </div>
          <div className="flex gap-10">
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase">Sync Time</p>
              <p className="text-2xl font-bold">{timeLeft}s</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase">Multiplier</p>
              <p className="text-2xl font-bold text-yellow-500">
                x{(1 + score / 500).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">
          <canvas
            ref={canvasRef}
            width={config.width}
            height={config.height}
            className="w-full h-auto cursor-none"
          />

          <AnimatePresence>
            {gameState !== "PLAYING" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50 text-center p-6"
              >
                <h2 className="text-7xl font-black text-white mb-4 tracking-tighter uppercase italic">
                  {gameState === "START" ? "Word Hunter" : "Session Finalized"}
                </h2>
                {gameState === "GAMEOVER" && (
                  <div className="mb-10 space-y-2">
                    <p className="text-cyan-400 text-6xl font-black italic">
                      {score}
                    </p>
                    <p className="text-zinc-500 tracking-widest text-xs uppercase underline underline-offset-8">
                      Data Stored: +{Math.floor(score / 4)} XP Added
                    </p>
                  </div>
                )}
                <button
                  onClick={startGame}
                  className="group relative px-16 py-6 bg-cyan-600 text-black font-black rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                >
                  <span className="relative z-10 uppercase tracking-widest text-lg">
                    Initialize Core
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {gameState === "PLAYING" && (
            <div className="absolute top-6 left-6 px-6 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-white font-black italic">
              SCORE: {score}
            </div>
          )}
        </div>

        {/* SEO & Instructional Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 pb-20">
          <div className="text-zinc-400 font-sans">
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight">
              Advanced Cognitive Literacy Training
            </h2>
            <p className="leading-relaxed mb-6 text-lg">
              **Word Catcher Pro+** has been updated to eliminate visual bias.
              Unlike standard word games, our neural interface forces the player
              to engage in full semantic processing.
            </p>
            <p className="leading-relaxed border-l-2 border-cyan-600 pl-6 italic">
              "By removing color-coded clues, we activate the brain's
              deep-reading pathways, ensuring that every point scored is a
              result of genuine vocabulary recognition."
            </p>
          </div>
          <div className="bg-[#0c0c0c] p-10 rounded-3xl border border-white/5 shadow-inner">
            <h3 className="text-cyan-500 font-bold uppercase tracking-widest text-sm mb-6">
              Module Specifications
            </h3>
            <ul className="space-y-4 text-sm font-mono">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Dynamic Difficulty</span>
                <span className="text-white">Active (Insane Mode)</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Visual Bias Guard</span>
                <span className="text-green-500">Enabled</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>XP Scaling Rate</span>
                <span className="text-white">25% of Score</span>
              </li>
              <li className="flex justify-between">
                <span>Rendering Engine</span>
                <span className="text-white">HTML5 Canvas (60FPS)</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WordCatcherProPlus;
