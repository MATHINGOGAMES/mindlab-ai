// src/core/ranks.js

export const RANKS = [
  { name: "Neural Novice", minXP: 0, color: "text-zinc-400", icon: "🌱" },
  { name: "Logic Architect", minXP: 500, color: "text-blue-400", icon: "🏗️" },
  { name: "Pattern Master", minXP: 1500, color: "text-purple-400", icon: "🧩" },
  {
    name: "Synapse Overlord",
    minXP: 3000,
    color: "text-yellow-500",
    icon: "⚡",
  },
  { name: "MindLab Legend", minXP: 6000, color: "text-green-400", icon: "🧠" },
];

export const getRank = (xp) => {
  // البحث عن أعلى رتبة تناسب الـ XP الحالي
  return [...RANKS].reverse().find((rank) => xp >= rank.minXP) || RANKS[0];
};

export const getNextRank = (xp) => {
  return RANKS.find((rank) => xp < rank.minXP) || null;
};
