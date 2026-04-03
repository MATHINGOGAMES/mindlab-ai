"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../core/store";
import { playSound } from "../../core/sounds";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

const MISSIONS = [
  {
    id: 1,
    words: ["The", "robot", "is", "learning"],
    correct: "The robot is learning",
    xp: 50,
  },
  {
    id: 2,
    words: ["I", "can", "build", "future", "the"],
    correct: "I can build the future",
    xp: 70,
  },
];

const MOLLY_MESSAGES = [
  "You didn't just build a sentence, you built a bridge to the future.",
  "Molly is proud of your mind. You are a true Architect of Knowledge.",
  "Every word you placed today is a stone in your castle of success.",
];

export default function SentenceArchitect() {
  // --- ربط نظام الداش بورد (MindLab Core) ---
  const { addXP, rank, level: globalLevel } = useGameStore();

  const [currentMission, setCurrentMission] = useState(0);
  const [userSentence, setUserSentence] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [victoryMsg, setVictoryMsg] = useState("");
  const [score, setScore] = useState(0);

  const initMission = useCallback((index) => {
    const words = [...MISSIONS[index].words].sort(() => Math.random() - 0.5);
    setShuffledWords(words);
    setUserSentence([]);
    setVictoryMsg("");
  }, []);

  useEffect(() => {
    initMission(currentMission);
  }, [currentMission, initMission]);

  const handleWordClick = (word, index) => {
    playSound("click");
    const newAnswer = [...userSentence, word];
    setUserSentence(newAnswer);

    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);

    if (newShuffled.length === 0) {
      checkResult(newAnswer);
    }
  };

  const checkResult = (finalAnswer) => {
    const isCorrect =
      finalAnswer.join(" ") === MISSIONS[currentMission].correct;

    if (isCorrect) {
      playSound("correct");
      const xpGained = MISSIONS[currentMission].xp;
      addXP(xpGained);
      setScore((prev) => prev + xpGained);

      if (currentMission < MISSIONS.length - 1) {
        setTimeout(() => setCurrentMission((prev) => prev + 1), 800);
      } else {
        setVictoryMsg(
          MOLLY_MESSAGES[Math.floor(Math.random() * MOLLY_MESSAGES.length)]
        );
        setIsModalOpen(true);
      }
    } else {
      playSound("wrong");
      setIsModalOpen(true);
    }
  };

  const handleUndo = (word, index) => {
    const newAnswer = [...userSentence];
    newAnswer.splice(index, 1);
    setUserSentence(newAnswer);
    setShuffledWords((prev) => [...prev, word]);
    playSound("click");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 flex flex-col items-center font-mono selection:bg-purple-500/30">
      <Helmet>
        <title>Sentence Architect | MindLab Pro AI</title>
        <meta
          name="description"
          content="Build English sentences and improve your grammar with Molly's AI guidance."
        />
      </Helmet>

      {/* --- Unified Dashboard (HUD) --- */}
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-5 mb-8 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[7px] text-purple-500 tracking-[0.4em] mb-1 uppercase">
              Linguistic_Processor_Active
            </p>
            <h2 className="text-2xl font-black italic tracking-tighter">
              {rank?.split("_")[0]}{" "}
              <span className="text-zinc-600 text-sm">v.{globalLevel}</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[7px] text-zinc-500 tracking-[0.4em] mb-1">
              TOTAL_XP
            </p>
            <p className="text-2xl font-black text-purple-400">{score}</p>
          </div>
        </div>
        <div className="mt-3 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentMission / MISSIONS.length) * 100}%` }}
            className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
          />
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 tracking-widest mb-4 uppercase">
        Mission_{currentMission + 1}_of_{MISSIONS.length}
      </p>

      {/* --- Bridge Area (The Construction Site) --- */}
      <div className="w-full max-w-2xl min-h-[140px] p-8 bg-zinc-900/20 border-2 border-dashed border-purple-500/10 rounded-[3rem] flex flex-wrap gap-3 justify-center items-center mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#a855f7_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />

        <AnimatePresence>
          {userSentence.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-700 text-sm italic"
            >
              Tap words below to start building...
            </motion.p>
          )}
          {userSentence.map((word, i) => (
            <motion.span
              layout
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              key={`ans-${i}-${word}`}
              onClick={() => handleUndo(word, i)}
              className="px-5 py-3 bg-purple-600/10 border border-purple-500/30 rounded-2xl text-purple-100 cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 transition-colors shadow-lg"
            >
              {word}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* --- Words Pool --- */}
      <div className="flex flex-wrap gap-4 justify-center max-w-xl">
        <AnimatePresence>
          {shuffledWords.map((word, i) => (
            <motion.button
              layout
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={`word-${i}-${word}`}
              onClick={() => handleWordClick(word, i)}
              className="px-7 py-4 bg-zinc-900 border border-white/5 rounded-[1.5rem] font-bold text-zinc-200 shadow-xl hover:border-purple-500/50 transition-all"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* --- Result Modal & Molly's Legacy --- */}
      <ResultModal
        isOpen={isModalOpen}
        status={victoryMsg ? "win" : "lose"}
        score={score}
        onRestart={() => window.location.reload()}
        nextLevel={() => {
          setIsModalOpen(false);
          if (!victoryMsg) initMission(currentMission);
        }}
      >
        {victoryMsg && (
          <div className="mt-6 p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
            <p className="text-purple-400 font-bold text-[10px] tracking-[0.3em] mb-2 uppercase text-center">
              Molly's Wisdom
            </p>
            <p className="text-cyan-100 italic text-sm text-center leading-relaxed">
              "{victoryMsg}"
            </p>
          </div>
        )}
      </ResultModal>
      {/* --- SEO OPTIMIZED & HIGH-CTR DESCRIPTION --- */}
      <footer className="w-full max-w-3xl mt-20 border-t border-white/5 pt-10 pb-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Column 1: High-SEO Educational Content */}
          <div className="space-y-4">
            <h3 className="text-purple-400 font-black text-lg tracking-tighter uppercase">
              Sentence Architect – The Best English Grammar Game for Kids
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              <strong className="text-zinc-200">Sentence Architect</strong> is
              one of the most engaging
              <span className="text-purple-500">
                {" "}
                English learning games for kids{" "}
              </span>{" "}
              designed to improve sentence building, grammar skills, and
              vocabulary in a fun and interactive way. Perfect for{" "}
              <strong>primary school students</strong>, this game uses proven
              <strong> gamification learning techniques </strong> to turn
              education into an exciting experience.
            </p>
            <ul className="text-zinc-500 text-xs space-y-2">
              <li>• Learn English sentence structure step by step.</li>
              <li>• Improve word order and grammar accuracy fast.</li>
              <li>• Boost vocabulary and language confidence.</li>
              <li>• Brain training through logic and quick thinking.</li>
            </ul>
          </div>

          {/* Column 2: Emotional + Trust + Tech SEO */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-black text-lg tracking-tighter uppercase">
              Why Kids Love Sentence Architect
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed italic">
              "Learning English has never been this fun!" Inspired by the vision
              of <span className="text-cyan-500">Molly Stone</span>, this game
              helps children become confident sentence builders while enjoying
              every step of the journey.
            </p>
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-zinc-500 leading-tight">
                <strong>Smart Learning System:</strong> Powered by
                <span className="text-purple-400"> MindLab Pro AI</span>, the
                game tracks progress using XP points, levels, and rewards —
                making it one of the most effective
                <strong> educational apps for kids </strong> available today.
              </p>
            </div>
          </div>
        </div>

        {/* HIGH-SEO TAGS */}
        <div className="mt-10 flex flex-wrap gap-2 opacity-40">
          {[
            "English Grammar Game for Kids",
            "Learn English Sentence Building",
            "Best Educational Games for Children",
            "Interactive English Learning App",
            "Grammar Practice for Primary Students",
            "Sentence Builder Game Online",
            "Kids Learning Games English",
            "Gamified Education App",
            "Brain Training for Kids",
            "Fun English Learning Activities",
          ].map((tag) => (
            <span
              key={tag}
              className="text-[9px] border border-zinc-700 px-2 py-1 rounded-md text-zinc-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
