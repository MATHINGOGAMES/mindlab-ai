"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { playSound } from "../../core/sounds";
import ResultModal from "../../components/shared/ResultModal";

const NEON_COLORS = [
  "text-cyan-400 shadow-[0_0_15px_cyan]",
  "text-pink-400 shadow-[0_0_15px_pink]",
  "text-purple-400 shadow-[0_0_15px_purple]",
  "text-green-400 shadow-[0_0_15px_green]",
];

function generateQuestion(level) {
  const operations = ["+", "-", "*", "/"];
  const max = 5 + level * 5;
  let a = Math.floor(Math.random() * max) + 1;
  let b = Math.floor(Math.random() * max) + 1;
  const op = operations[Math.floor(Math.random() * operations.length)];

  if (op === "/") a = a * b;

  let answer;
  switch (op) {
    case "+":
      answer = a + b;
      break;
    case "-":
      answer = a - b;
      break;
    case "*":
      answer = a * b;
      break;
    case "/":
      answer = Math.floor(a / b);
      break;
  }

  const options = [answer];
  while (options.length < 3) {
    const fake = answer + Math.floor(Math.random() * 10 - 5);
    if (!options.includes(fake)) options.push(fake);
  }

  return {
    question: `${a} ${op} ${b} = ?`,
    answer,
    options: options.sort(() => Math.random() - 0.5),
  };
}

export default function NeonMathAdvancedPro() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState({});
  const [timeLeft, setTimeLeft] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("win");
  const [flash, setFlash] = useState(null);

  const timerRef = useRef(null);

  const loadQuestion = () => {
    const q = generateQuestion(level);
    setQuestion(q);
    setTimeLeft(10);
    setFlash(null);
  };

  // العد التنازلي لكل سؤال
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          playSound("wrong");
          setStatus("lose");
          setIsModalOpen(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [question]);

  // تحميل سؤال جديد عند تغيير المستوى
  useEffect(() => {
    loadQuestion();
  }, [level]);

  const handleAnswer = (opt, idx) => {
    if (opt === question.answer) {
      playSound("correct");
      setFlash(idx); // تفعيل Flash للزر
      setScore((s) => s + 10 + timeLeft);
      setTimeout(() => {
        setLevel((l) => l + 1);
        loadQuestion();
      }, 500);
    } else {
      playSound("wrong");
      setStatus("lose");
      setIsModalOpen(true);
    }
  };

  const resetGame = () => {
    setIsModalOpen(false);
    setLevel(1);
    setScore(0);
    loadQuestion();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-8 font-sans">
      {/* Stats */}
      <div className="flex gap-8 bg-zinc-900/50 px-10 py-4 rounded-3xl border border-white/5 mb-12">
        <Stat label="LEVEL" value={level} color="text-blue-400" />
        <Stat label="SCORE" value={score} color="text-green-400" />
        <Stat label="TIME" value={timeLeft} color="text-pink-400" />
      </div>

      {/* Question */}
      <div className="text-4xl font-black text-cyan-400 mb-12 shadow-[0_0_20px_cyan]">
        {question.question}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-md w-full">
        {question.options?.map((opt, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleAnswer(opt, idx)}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px cyan" }}
            whileTap={{ scale: 0.95 }}
            animate={
              flash === idx
                ? { scale: [1, 1.2, 1], boxShadow: "0 0 25px cyan" }
                : {}
            }
            className={`h-24 sm:h-32 rounded-3xl flex items-center justify-center text-4xl font-black transition-all duration-300 bg-[#111111] border border-white/5 ${
              NEON_COLORS[level % NEON_COLORS.length]
            } ${timeLeft <= 3 ? "animate-pulse" : ""}`}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={isModalOpen}
        status={status}
        score={score}
        time={`Level ${level}`}
        onRestart={resetGame}
        nextLevel={resetGame}
      />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] font-black text-zinc-600 tracking-widest mb-1">
        {label}
      </span>
      <span className={`text-2xl font-black ${color}`}>{value}</span>
    </div>
  );
}
