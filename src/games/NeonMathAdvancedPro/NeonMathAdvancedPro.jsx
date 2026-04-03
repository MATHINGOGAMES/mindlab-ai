"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../core/sounds";
import { useGameEngine } from "../../core/game-engine";
import { Helmet } from "react-helmet-async";
import ResultModal from "../../components/shared/ResultModal";

const WORLDS = [
  {
    id: 1,
    name: "NEON JUNGLE",
    color: "from-green-500",
    text: "text-green-500",
  },
  { id: 2, name: "CYBER CITY", color: "from-blue-500", text: "text-blue-500" },
  {
    id: 3,
    name: "SILICON VALLEY",
    color: "from-purple-500",
    text: "text-purple-500",
  },
  { id: 4, name: "CORE SERVER", color: "from-red-500", text: "text-red-500" },
];

export default function NeonMathAdvancedPro() {
  const { question, timeLeft, answer, profile } = useGameEngine();

  const [currentWorldIdx, setCurrentWorldIdx] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [isBossLevel, setIsBossLevel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const streakMod = profile.streak % 10;
    setIsBossLevel(streakMod === 9);

    if (profile.streak > 0 && profile.streak % 10 === 0 && !showMap) {
      setShowMap(true);
      setTimeout(() => {
        setShowMap(false);
        setCurrentWorldIdx((prev) => (prev + 1) % WORLDS.length);
      }, 3000);
    }
  }, [profile.streak]);

  const handleChoice = (opt) => {
    if (opt === question.answer) {
      playSound("correct");
    } else {
      playSound("wrong");
      setIsModalOpen(true);
    }
    answer(opt);
  };

  const currentWorld = WORLDS[currentWorldIdx];

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center p-6 text-white font-mono">
      <Helmet>
        <title>Neon Math Advanced Pro | MindLab AI</title>
      </Helmet>

      {/* HEADER */}
      <div className="w-full max-w-xl mb-10 flex justify-between border-b border-white/5 pb-4">
        <div>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
            Current Sector
          </p>
          <h2 className={`text-2xl font-black ${currentWorld.text}`}>
            {currentWorld.name}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
            Progress
          </p>
          <p className="text-xl font-black">{profile.streak % 10}/10</p>
        </div>
      </div>

      {/* QUESTION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question?.question}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[100px] font-black mb-12"
        >
          {question?.question}
        </motion.div>
      </AnimatePresence>

      {/* OPTIONS */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
        {question?.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleChoice(opt)}
            className="h-28 rounded-3xl text-4xl font-black bg-zinc-900 border border-white/5 hover:border-cyan-400"
          >
            {opt}
          </button>
        ))}
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="w-full max-w-5xl mt-24 border-t border-white/5 pt-12 pb-20 px-6 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 opacity-20">
          <div
            className={`w-full h-full bg-gradient-to-r ${currentWorld.color} to-transparent blur-3xl animate-pulse`}
          />
        </div>

        {/* Header */}
        <h3
          className={`text-xl font-black tracking-widest ${currentWorld.text}`}
        >
          NEURAL SYSTEM HUB
        </h3>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <Stat
            label="PLAYERS"
            value={Math.floor(1200 + Math.random() * 300)}
          />
          <Stat label="XP" value={profile.xp} />
          <Stat
            label="LOAD"
            value={`${Math.floor(60 + Math.random() * 30)}%`}
          />
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm mt-8 max-w-xl mx-auto">
          Neon Math is an AI-powered brain training game designed to improve
          speed, logic, and mental calculation through immersive gameplay.
        </p>

        {/* CTA */}
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="px-4 py-2 bg-cyan-500 text-black rounded-xl text-xs font-black"
          >
            Share
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-xs"
          >
            Restart
          </button>
        </div>

        {/* Status */}
        <p
          className={`mt-6 text-sm font-black ${
            isBossLevel ? "text-red-500" : currentWorld.text
          }`}
        >
          {isBossLevel ? "⚠ BOSS ACTIVE" : "SYSTEM STABLE"}
        </p>

        {/* Copyright */}
        <p className="mt-10 text-[10px] text-zinc-700">
          © {new Date().getFullYear()} MindLab AI
        </p>
      </footer>

      <ResultModal
        isOpen={isModalOpen}
        status="lose"
        score={profile.xp}
        onRestart={() => window.location.reload()}
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] text-zinc-500">{label}</span>
      <span className="text-lg font-black">{value}</span>
    </div>
  );
}
