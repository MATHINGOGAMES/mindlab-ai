export function adjustDifficulty(accuracy, currentLevel) {
  if (accuracy > 0.8) return currentLevel + 1;
  if (accuracy < 0.5) return currentLevel - 1;
  return currentLevel;
}