"use client";

import { motion } from "framer-motion";
import MonsterIDCard from "./components/MonsterIDCard"; // البطاقة التي صممناها

export default function MonsterVault() {
  return (
    <div className="min-h-screen bg-[#050505] p-8">
      {/* --- Vault Header --- */}
      <header className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-black italic tracking-tighter text-white mb-4">
          THE MONSTER <span className="text-cyan-500">VAULT</span>
        </h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em]">
          Synthesized Biology & Linguistic Guardians
        </p>
      </header>

      {/* --- Categories & Grid --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* الوحش الأول: H-Zero (مفتوح) */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-cyan-500/20 rounded-[3.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
          <MonsterIDCard />
        </div>

        {/* وحش مستقبلي (مقفل) */}
        <div className="relative opacity-20 grayscale cursor-not-allowed">
          <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center p-20 text-center">
            <span className="text-4xl mb-4">🔒</span>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              Required: Atomic Level 5
            </p>
          </div>
        </div>
      </div>

      {/* --- Bottom Status Bar --- */}
      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-xl border border-white/5 px-8 py-4 rounded-full">
        <p className="text-[9px] text-zinc-400 font-mono">
          VAULT STATUS:{" "}
          <span className="text-cyan-500 underline">
            1/118 ELEMENTS DISCOVERED
          </span>
        </p>
      </footer>
    </div>
  );
}
