// 🤖 Neural Advisor Database - Bilingual (AR/EN)

const ADVICE_DATABASE = [
  {
    category: "logic",
    en:
      "Logic is the language of the universe. In Sudoku, try to look for 'hidden singles' to speed up your solving process.",
    ar:
      "المنطق هو لغة الكون. في السودوكو، حاول البحث عن 'الأرقام المخفية الوحيدة' لتسريع عملية الحل.",
  },
  {
    category: "memory",
    en:
      "Your brain is a muscle. Visualizing patterns before clicking in Memory games strengthens your neural pathways.",
    ar:
      "دماغك عضلة. تخيل الأنماط قبل النقر في ألعاب الذاكرة يقوي مساراتك العصبية.",
  },
  {
    category: "focus",
    en:
      "Deep focus requires a calm mind. Take a deep breath before starting a 'Hard' level to lower cognitive noise.",
    ar:
      "التركيز العميق يتطلب عقلاً هادئاً. خذ نفساً عميقاً قبل بدء مستوى 'صعب' لتقليل الضجيج الإدراكي.",
  },
  {
    category: "math",
    en:
      "Mental arithmetic fluidizes your thoughts. Use Neural Grid to bridge the gap between intuition and calculation.",
    ar:
      "الحساب الذهني يجعل تفكيرك أكثر مرونة. استخدم الشبكة العصبية لسد الفجوة بين الحدس والحساب.",
  },
  {
    category: "growth",
    en:
      "Consistency is better than intensity. 10 minutes of brain training daily is more effective than 2 hours once a week.",
    ar:
      "الاستمرارية أفضل من الكثافة. 10 دقائق من تدريب الدماغ يومياً أكثر فعالية من ساعتين مرة واحدة في الأسبوع.",
  },
  {
    category: "spatial",
    en:
      "Geometry Memory isn't just about shapes; it's about spatial awareness. Try to anchor objects to a fixed point in your mind.",
    ar:
      "الذاكرة الهندسية ليست مجرد أشكال؛ إنها وعي مكاني. حاول ربط الأجسام بنقطة ثابتة في مخيلتك.",
  },
  {
    category: "general",
    en:
      "Rest is part of the training. Your brain archives what you've learned during sleep and breaks.",
    ar:
      "الراحة جزء من التدريب. يقوم دماغك بأرشفة ما تعلمته أثناء النوم وفترات الراحة.",
  },
];

/**
 * دالة جلب نصيحة عشوائية
 * يمكن تطويرها لاحقاً لتأخذ 'stats' كبراميمتر وتختار نصيحة بناءً على أقل مهارة لدى اللاعب
 */
export const getSmartAdvice = () => {
  const randomIndex = Math.floor(Math.random() * ADVICE_DATABASE.length);
  return ADVICE_DATABASE[randomIndex];
};
