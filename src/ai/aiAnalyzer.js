export function analyzePerformance(history) {
  let correct = history.filter(h => h.correct).length;
  let wrong = history.length - correct;

  return {
    accuracy: correct / history.length,
    level: correct > wrong ? "up" : "down"
  };
}