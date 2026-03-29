export function analyzePlayerModel(history) {
  const stats = {
    arithmetic: { correct: 0, wrong: 0 },
    geometric: { correct: 0, wrong: 0 },
    mixed: { correct: 0, wrong: 0 },
  };

  history.forEach((h) => {
    if (!h.pattern) return;
    if (h.correct) stats[h.pattern].correct++;
    else stats[h.pattern].wrong++;
  });

  const weaknesses = Object.entries(stats)
    .map(([type, val]) => ({
      type,
      score: val.correct - val.wrong,
    }))
    .sort((a, b) => a.score - b.score);

  return {
    weakest: weaknesses[0]?.type || "arithmetic",
    stats,
  };
}