import { create } from "zustand";

export const useGameStore = create((set) => ({
  xp: 0,
  level: 1,

  addXP: (amount) =>
    set((state) => {
      const newXP = state.xp + amount;
      const levelUp = Math.floor(newXP / 100);

      return {
        xp: newXP % 100,
        level: state.level + levelUp,
      };
    }),
}));
