"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../core/sounds";
import { generateAIGrid } from "../../ai/aiGridGenerator";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

export default function NeuralGrid() {
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState("loading");
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [powers, setPowers] = useState({ slow: 3, reveal: 2 });
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flash, setFlash] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // --- Haptic Feedback ---
  const vibrate = (pattern) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // --- Game Logic ---
  const nextChallenge = useCallback(async () => {
    setStatus("loading");
    setUserInput("");
    const data = await generateAIGrid(level, 3, "GRID", "PRIMARY");
    if (data?.displayGrid) {
      setGrid(data.displayGrid);
      setAnswer(data.answer);
      setEnergy(100);
      setStatus("playing");
      startTimeRef.current = Date.now();
    }
  }, [level]);

  useEffect(() => {
    nextChallenge();
  }, [nextChallenge]);

  useEffect(() => {
    if (status === "playing" && energy > 0) {
      const decayBase = 0.35 + level * 0.07;
      const speed = isSlowMo ? 0.06 : decayBase;
      timerRef.current = setInterval(() => {
        setEnergy((e) => Math.max(0, e - speed));
      }, 100);
    }
    if (energy === 0 && status === "playing") {
      playSound("wrong");
      vibrate([100, 50, 100]);
      setIsModalOpen(true);
    }
    return () => clearInterval(timerRef.current);
  }, [status, energy, level, isSlowMo]);

  const handleKey = (key) => {
    if (status !== "playing") return;
    vibrate(15);
    if (key === "clear") return setUserInput("");
    if (key === "enter") return submit();
    if (userInput.length < 4) setUserInput((prev) => prev + key);
  };

  const submit = () => {
    if (!userInput || status !== "playing") return;
    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    if (parseInt(userInput) === answer) {
      processSuccess(timeTaken);
    } else {
      processFailure();
    }
  };

  const processSuccess = (time) => {
    playSound("correct");
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
    vibrate(30);
    const newCombo = combo + 1;
    setCombo(newCombo);
    let points = Math.floor(energy * 5) * (1 + newCombo * 0.15);
    if (time < 1.8) points *= 1.5;
    setScore((s) => s + Math.floor(points));
    setStatus("success");
    setTimeout(() => {
      setLevel((l) => l + 1);
      nextChallenge();
    }, 400);
  };

  const processFailure = () => {
    playSound("wrong");
    vibrate([20, 60, 20]);
    setCombo(0);
    setStatus("error");
    setEnergy((e) => Math.max(0, e - 20));
    setTimeout(() => setStatus("playing"), 600);
  };

  useEffect(() => {
    if (userInput.length >= 3 && status === "playing") {
      const t = setTimeout(() => submit(), 500);
      return () => clearTimeout(t);
    }
  }, [userInput]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-4 font-mono select-none overflow-x-hidden">
      <Helmet>
        <title>Neural Grid Pro | Decode the System</title>
      </Helmet>

      {/* --- Flash Effect --- */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cyan-400 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* --- HUD --- */}
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-3xl p-4 mb-6 shadow-2xl">
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-[8px] text-zinc-500 tracking-[0.3em]">
              NODE_LEVEL
            </p>
            <p className="text-xl font-black text-cyan-400">
              0x{level.toString(16).toUpperCase()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[8px] text-zinc-500 tracking-[0.3em]">COMBO</p>
            <motion.p
              key={combo}
              animate={{ scale: [1, 1.2, 1] }}
              className="text-xl font-black text-fuchsia-500"
            >
              {combo > 0 ? `🔥 x${combo}` : "--"}
            </motion.p>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-zinc-500 tracking-[0.3em]">
              TOTAL_XP
            </p>
            <p className="text-xl font-black text-amber-500">
              {score.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${energy}%` }}
            className={`h-full shadow-[0_0_10px_currentColor] ${
              energy < 30 ? "bg-red-500" : "bg-cyan-400"
            }`}
          />
        </div>
      </div>

      {/* --- Main Game --- */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-md">
        <motion.div
          key={level}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="grid grid-cols-3 gap-3 p-4 bg-zinc-950 rounded-[2.5rem] border-2 border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl text-2xl font-black border border-white/5 bg-[#080808] ${
                  cell === "?"
                    ? "text-white shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-pulse"
                    : "text-cyan-400/60"
                }`}
              >
                {cell}
              </div>
            ))
          )}
        </motion.div>

        <div className="text-center">
          <motion.div
            key={userInput}
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            className={`text-6xl font-black tracking-tighter ${
              status === "error" ? "text-red-500" : "text-white"
            }`}
          >
            {userInput || <span className="opacity-10 font-thin">000</span>}
          </motion.div>
          <p className="text-[7px] tracking-[0.8em] text-zinc-600 mt-2 uppercase italic">
            Awaiting_Manual_Input
          </p>
        </div>
      </div>

      {/* --- Keypad & Powers --- */}
      <div className="w-full max-w-sm mt-8 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✓"].map((k) => (
            <button
              key={k}
              onClick={() =>
                k === "⌫"
                  ? handleKey("clear")
                  : k === "✓"
                  ? submit()
                  : handleKey(k)
              }
              className={`h-14 rounded-2xl text-xl font-black border border-white/5 active:scale-95 transition-all ${
                k === "✓"
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                  : k === "⌫"
                  ? "bg-red-500/10 text-red-500"
                  : "bg-zinc-900/40 hover:bg-zinc-800"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            disabled={powers.slow === 0 || isSlowMo}
            onClick={() => {
              setPowers((p) => ({ ...p, slow: p.slow - 1 }));
              setIsSlowMo(true);
              setTimeout(() => setIsSlowMo(false), 5000);
            }}
            className={`flex-1 h-12 rounded-xl border border-white/5 text-[9px] font-black tracking-widest ${
              isSlowMo
                ? "bg-cyan-500 text-black animate-pulse"
                : "bg-zinc-900/80 text-zinc-500"
            }`}
          >
            🧊 TIME_DILATE [{powers.slow}]
          </button>
          <button
            disabled={powers.reveal === 0}
            onClick={() => {
              setPowers((p) => ({ ...p, reveal: p.reveal - 1 }));
              setUserInput(answer.toString());
            }}
            className="flex-1 h-12 rounded-xl border border-white/5 bg-zinc-900/80 text-zinc-500 text-[9px] font-black tracking-widest"
          >
            💡 AUTO_REVEAL [{powers.reveal}]
          </button>
        </div>
      </div>

      <ResultModal
        isOpen={isModalOpen}
        status="lose"
        score={score}
        onRestart={() => {
          setCombo(0);
          setLevel(1);
          setScore(0);
          setIsModalOpen(false);
          nextChallenge();
        }}
      />

      {/* --- SEO & GUIDE SECTION --- */}
      <section className="w-full max-w-4xl mt-20 border-t border-white/5 pt-12 pb-20 px-4 font-sans">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Arabic Version */}
          <div dir="rtl" className="space-y-6">
            <h2 className="text-2xl font-black text-cyan-400">
              لغز الشبكة العصبية: تحدي فك التشفير
            </h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                <strong className="text-white">ما هي اللعبة؟</strong> Neural
                Grid هي تجربة ذهنية مصممة لرفع سرعة المعالجة المنطقية في دماغك
                من خلال أنماط رياضية متسارعة.
              </p>
              <h3 className="text-white font-bold">طريقة اللعب:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  حل النمط الرقمي في الشبكة وأدخل الرقم المفقيد مكان{" "}
                  <span className="text-cyan-400">?</span>.
                </li>
                <li>
                  حافظ على <span className="text-fuchsia-500">Combo</span> مرتفع
                  لمضاعفة نقاطك.
                </li>
                <li>
                  استخدم <span className="text-white">Time Dilate</span> لإبطاء
                  الوقت عند الألغاز الصعبة.
                </li>
              </ul>
              <p className="text-xs italic text-zinc-500">
                #تدريب_العقل #سرعة_البديهة #ألغاز_ذكاء
              </p>
            </div>
          </div>

          {/* English Version (SEO Optimized) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-cyan-400">
              Neural Grid: Ultimate Speed Decoding Challenge
            </h2>
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
              <p>
                <strong className="text-white">The Concept:</strong> Neural Grid
                is a high-octane brain training game. It challenges your brain's
                ability to recognize mathematical patterns and decode encrypted
                data under intense time pressure.
              </p>
              <h3 className="text-white font-bold">How to Play:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Identify the logic in the 3x3 grid and input the missing value{" "}
                  <span className="text-cyan-400">?</span>.
                </li>
                <li>
                  Speed is key! Maintain a{" "}
                  <span className="text-fuchsia-500">Combo Streak</span> to
                  boost your score multiplier.
                </li>
                <li>
                  Manage your <span className="text-red-500">Energy Bar</span>;
                  every millisecond counts in the cyber world.
                </li>
              </ul>
              <p className="text-xs italic text-zinc-500">
                #BrainTraining #LogicPuzzle #CyberGame #CognitiveSkills
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
