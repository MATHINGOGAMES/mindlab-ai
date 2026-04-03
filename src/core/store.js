import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGameStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      rank: "NEURAL_INITIATE", // رتبة البداية
      totalGames: 0,
      streak: 0, // عدد أيام اللعب المتواصل

      // 🌟 اللمسة السحرية: نظام إضافة الـ XP الذكي
      addXP: (amount) => {
        set((state) => {
          const totalXP = state.xp + amount;
          const levelUps = Math.floor(totalXP / 100);
          const remainingXP = totalXP % 100;
          const newLevel = state.level + levelUps;

          // تحديث الرتبة بناءً على المستوى
          let newRank = state.rank;
          if (newLevel >= 5) newRank = "CYBER_ANALYST";
          if (newLevel >= 15) newRank = "LOGIC_ARCHITECT";
          if (newLevel >= 30) newRank = "MINDLAB_MASTER";

          // إذا حدث Level Up، يمكننا إطلاق صوت أو تأثير لاحقاً
          if (levelUps > 0) {
            console.log(
              `%c ⚡ LEVEL UP: ${newLevel} `,
              "background: #00d2ff; color: #000; font-weight: bold;"
            );
          }

          return {
            xp: remainingXP,
            level: newLevel,
            rank: newRank,
            totalGames: state.totalGames + 1,
          };
        });
      },

      // إعادة ضبط النظام (لأغراض الاختبار)
      resetProfile: () =>
        set({ xp: 0, level: 1, rank: "NEURAL_INITIATE", totalGames: 0 }),
    }),
    {
      name: "mindlab-v2-storage", // يحفظ البيانات في المتصفح حتى لو أغلق المستخدم الصفحة
    }
  )
);
