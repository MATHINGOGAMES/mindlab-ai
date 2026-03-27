"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateGrid } from "./engine"; // تأكد من صحة المسار
import { useGameStore } from "../../core/store";
import { playSound } from "../../core/sounds";

export default function NeuralGrid() {
  // --- State الموحد لمنع تعارض البيانات ---
  const [gameState, setGameState] = useState({
    level: 1,
    data: generateGrid(1),
    input: "",
    time: 10,
    score: 0,
    combo: 0,
    feedback: "",
    status: "playing", // 'playing', 'checking'
    isFrozen: false,
  });

  const addXP = useGameStore((s) => s.addXP);
  const inputRef = useRef(null);

  // --- دالة الانتقال للمستوى التالي ---
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

  // --- التعامل مع الإجابة الخاطئة ---
  const handleFail = useCallback(() => {
    if (gameState.status === "checking") return;

    playSound("wrong");
    setGameState((prev) => ({
      ...prev,
      feedback: "❌ Wrong!",
      combo: 0,
      status: "checking",
    }));

    setTimeout(nextLevel, 800);
  }, [nextLevel, gameState.status]);

  // --- التعامل مع الإجابة الصحيحة ---
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
        feedback: isNowFrozen ? "❄️ TIME FROZEN!" : "✅ Correct!",
        status: "checking",
      };
    });

    setTimeout(nextLevel, 600);
  }, [addXP, nextLevel]);

  // --- التحقق من الإجابة ---
  const checkAnswer = () => {
    if (gameState.status !== "playing" || !gameState.input) return;

    if (parseInt(gameState.input) === gameState.data.answer) {
      handleSuccess();
    } else {
      handleFail();
    }
  };

  // --- المؤقت (Timer) ---
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

  // تركيز تلقائي على الإدخال
  useEffect(() => {
    inputRef.current?.focus();
  }, [gameState.level]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden p-6">
      {/* المعلومات العلوية */}
      <div className="flex gap-10 mb-8 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-xl">
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

      <h1 className="text-5xl font-black mb-10 tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        NEURAL GRID
      </h1>

      {/* شريط الوقت */}
      <div className="w-64 h-2 bg-gray-800 rounded-full mb-10 overflow-hidden shadow-inner">
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
          className="h-full"
        />
      </div>

      {/* عرض الشبكة - مع حماية ضد الـ Undefined */}
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState.level}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="grid grid-cols-3 gap-4 bg-gray-900/40 p-6 rounded-[2rem] border border-white/5 shadow-2xl"
        >
          {gameState.data?.displayGrid?.map((row, i) =>
            row.map((cell, j) => (
              <motion.div
                key={`${i}-${j}`}
                whileHover={{ scale: 1.05 }}
                className={`w-20 h-20 flex items-center justify-center rounded-2xl text-2xl font-bold transition-colors
                  ${
                    cell === "?"
                      ? "bg-purple-600 shadow-[0_0_25px_rgba(147,51,234,0.4)] animate-pulse"
                      : "bg-white/5 border border-white/10 text-gray-400"
                  }`}
              >
                {cell}
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* منطقة الإدخال */}
      <div className="mt-12 flex flex-col items-center gap-6">
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
          className="bg-transparent border-b-2 border-purple-500 text-5xl text-center w-32 focus:outline-none focus:border-pink-500 transition-all font-mono"
          placeholder="?"
          disabled={gameState.status !== "playing"}
        />

        <button
          onClick={checkAnswer}
          className="px-10 py-3 bg-white text-black font-bold rounded-xl hover:bg-purple-500 hover:text-white transition-all transform active:scale-95"
        >
          SUBMIT
        </button>
      </div>

      {/* التغذية الراجعة */}
      <AnimatePresence>
        {gameState.feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`mt-8 text-2xl font-black ${
              gameState.feedback.includes("✅") ||
              gameState.feedback.includes("❄️")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {gameState.feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// مكون فرعي للإحصائيات
function StatItem({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] uppercase opacity-50 font-bold tracking-tighter">
        {label}
      </span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
    </div>
  );
}
