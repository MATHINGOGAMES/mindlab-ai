const PATTERNS = {
  ARITHMETIC: "arithmetic",
  GEOMETRIC: "geometric",
  MIXED: "mixed",
};

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function generateSequence(type, length, level) {
  const MAX_SAFE_VALUE = 999;

  const strategies = {
    [PATTERNS.ARITHMETIC]: () => {
      const base = getRandomInt(1, level * 2 + 5);
      const step = getRandomInt(1, level + 2);
      return Array.from({ length }, (_, i) => base + i * step);
    },

    [PATTERNS.GEOMETRIC]: () => {
      const ratio = level < 4 ? 2 : getRandomInt(2, 3);
      const maxBase = Math.max(
        1,
        Math.floor(MAX_SAFE_VALUE / Math.pow(ratio, length - 1))
      );
      const base = getRandomInt(1, Math.min(level + 2, maxBase));
      return Array.from({ length }, (_, i) => base * Math.pow(ratio, i));
    },

    [PATTERNS.MIXED]: () => {
      const base = getRandomInt(1, level * 3);
      const stepA = level;
      const stepB = level + 2;
      let current = base;
      return Array.from({ length }, (_, i) => {
        if (i === 0) return current;
        current += i % 2 === 0 ? stepA : stepB;
        return current;
      });
    },
  };

  let result = strategies[type] ? strategies[type]() : [];

  if (result.some((num) => num > MAX_SAFE_VALUE)) {
    return strategies[PATTERNS.ARITHMETIC]();
  }

  return result;
}

export function generateGrid(level = 1, size = 3) {
  let availablePatterns = [PATTERNS.ARITHMETIC];
  if (level > 2) availablePatterns.push(PATTERNS.MIXED);
  if (level > 4) availablePatterns.push(PATTERNS.GEOMETRIC);

  const selectedPattern =
    availablePatterns[getRandomInt(0, availablePatterns.length - 1)];

  const sequence = generateSequence(selectedPattern, size * size, level);

  const hiddenRow = getRandomInt(0, size - 1);
  const hiddenCol = getRandomInt(0, size - 1);

  let answer = null;

  const displayGrid = Array.from({ length: size }, (_, rIdx) =>
    Array.from({ length: size }, (_, cIdx) => {
      const value = sequence[rIdx * size + cIdx];
      if (rIdx === hiddenRow && cIdx === hiddenCol) {
        answer = value;
        return "?";
      }
      return value;
    })
  );

  return {
    displayGrid,
    answer,
    metadata: {
      level,
      pattern: selectedPattern,
      size,
    },
  };
}
