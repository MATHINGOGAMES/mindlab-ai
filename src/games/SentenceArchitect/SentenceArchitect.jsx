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
  const { addXP, rank, level: globalLevel } = useGameStore();

  const [currentMission, setCurrentMission] = useState(0);
  const [userSentence, setUserSentence] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [victoryMsg, setVictoryMsg] = useState("");
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false); // حالة جديدة للتحقق من صحة الجملة

  const initMission = useCallback((index) => {
    const words = [...MISSIONS[index].words].sort(() => Math.random() - 0.5);
    setShuffledWords(words);
    setUserSentence([]);
    setVictoryMsg("");
    setIsCorrect(false); // إعادة تصفير حالة الإجابة
  }, []);

  useEffect(() => {
    initMission(currentMission);
  }, [currentMission, initMission]);

  const handleWordClick = (word, index) => {
    if (isCorrect) return; // منع الضغط إذا كانت الإجابة صحيحة بالفعل
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
    const correctStr = MISSIONS[currentMission].correct;
    const userStr = finalAnswer.join(" ");

    if (userStr === correctStr) {
      playSound("correct");
      setIsCorrect(true); // تفعيل حالة الإجابة الصحيحة لإظهار زر المتابعة
      const xpGained = MISSIONS[currentMission].xp;
      addXP(xpGained);
      setScore((prev) => prev + xpGained);

      // إذا كانت هذه آخر مهمة، أظهر المودال النهائي
      if (currentMission === MISSIONS.length - 1) {
        setVictoryMsg(
          MOLLY_MESSAGES[Math.floor(Math.random() * MOLLY_MESSAGES.length)]
        );
        setTimeout(() => setIsModalOpen(true), 1000);
      }
    } else {
      playSound("wrong");
      setTimeout(() => {
        // إعادة الكلمات للمسبح إذا كانت خاطئة ليعيد المحاولة
        setShuffledWords(
          [...MISSIONS[currentMission].words].sort(() => Math.random() - 0.5)
        );
        setUserSentence([]);
      }, 1000);
    }
  };

  const handleNextMission = () => {
    if (currentMission < MISSIONS.length - 1) {
      setCurrentMission((prev) => prev + 1);
    }
  };

  const handleUndo = (word, index) => {
    if (isCorrect) return;
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
      </Helmet>

      {/* --- HUD Header --- */}
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
      </div>

      {/* --- Construction Site --- */}
      <div
        className={`w-full max-w-2xl min-h-[140px] p-8 bg-zinc-900/20 border-2 border-dashed ${
          isCorrect ? "border-green-500/50" : "border-purple-500/10"
        } rounded-[3rem] flex flex-wrap gap-3 justify-center items-center mb-8 relative transition-all`}
      >
        <AnimatePresence>
          {userSentence.map((word, i) => (
            <motion.span
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={`ans-${i}`}
              onClick={() => handleUndo(word, i)}
              className={`px-5 py-3 ${
                isCorrect
                  ? "bg-green-500/20 border-green-500/40"
                  : "bg-purple-600/10 border-purple-500/30"
              } border rounded-2xl text-purple-100 cursor-pointer shadow-lg`}
            >
              {word}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* --- Action Area (الزر الجديد للمتابعة) --- */}
      <div className="h-20 mb-8">
        {isCorrect && currentMission < MISSIONS.length - 1 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNextMission}
            className="px-10 py-4 bg-green-500 text-black font-black rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-transform"
          >
            CONTINUE TO NEXT MISSION →
          </motion.button>
        )}
      </div>

      {/* --- Words Pool --- */}
      {!isCorrect && (
        <div className="flex flex-wrap gap-4 justify-center max-w-xl">
          {shuffledWords.map((word, i) => (
            <motion.button
              layout
              whileHover={{ scale: 1.05 }}
              key={`word-${i}`}
              onClick={() => handleWordClick(word, i)}
              className="px-7 py-4 bg-zinc-900 border border-white/5 rounded-[1.5rem] font-bold text-zinc-200 shadow-xl hover:border-purple-500/50 transition-all"
            >
              {word}
            </motion.button>
          ))}
        </div>
      )}

      {/* --- Modals & Footer (تبقى كما هي) --- */}
      <ResultModal
        isOpen={isModalOpen}
        status={victoryMsg ? "win" : "lose"}
        score={score}
        onRestart={() => window.location.reload()}
        nextLevel={() => setIsModalOpen(false)}
      >
        {victoryMsg && (
          <p className="text-cyan-100 text-center italic">"{victoryMsg}"</p>
        )}
      </ResultModal>
    </div>
  );
}
