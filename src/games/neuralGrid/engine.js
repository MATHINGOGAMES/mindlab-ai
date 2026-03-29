const PATTERNS = {
  ARITHMETIC: "arithmetic",
  GEOMETRIC: "geometric",
  MIXED: "mixed",
  RANDOM: "random",
};

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a sequence based on type, length, and level
function generateSequence(type, length, level) {
  const MAX_SAFE_VALUE = 9999;
  let result = [];

  const strategies = {
    [PATTERNS.ARITHMETIC]: () => {
      const base = getRandomInt(1, level * 5 + 5);
      const step = getRandomInt(1, level + 5);
      return Array.from({ length }, (_, i) => base + i * step);
    },

    [PATTERNS.GEOMETRIC]: () => {
      const ratio = level < 3 ? 2 : getRandomInt(2, 4);
      const maxBase = Math.max(
        1,
        Math.floor(MAX_SAFE_VALUE / Math.pow(ratio, length - 1))
      );
      const base = getRandomInt(1, Math.min(level + 3, maxBase));
      return Array.from({ length }, (_, i) => base * Math.pow(ratio, i));
    },

    [PATTERNS.MIXED]: () => {
      const base = getRandomInt(1, level * 3 + 1);
      const stepA = level + 1;
      const stepB = level + 2;
      let current = base;
      return Array.from({ length }, (_, i) => {
        if (i === 0) return current;
        current += i % 2 === 0 ? stepA : stepB;
        return current;
      });
    },

    [PATTERNS.RANDOM]: () => {
      return Array.from({ length }, () => getRandomInt(1, level * 10 + 5));
    },
  };

  result = strategies[type]
    ? strategies[type]()
    : strategies[PATTERNS.ARITHMETIC]();

  // If any number exceeds max safe value, regenerate as arithmetic
  if (result.some((num) => num > MAX_SAFE_VALUE)) {
    return generateSequence(PATTERNS.ARITHMETIC, length, level);
  }

  return result;
}

// Generate a grid for the Neural Grid game with hidden cells
export function generateGrid(level = 1, size = 3) {
  let availablePatterns = [PATTERNS.ARITHMETIC];
  if (level > 2) availablePatterns.push(PATTERNS.MIXED);
  if (level > 4) availablePatterns.push(PATTERNS.GEOMETRIC);
  if (level > 6) availablePatterns.push(PATTERNS.RANDOM);

  const selectedPattern =
    availablePatterns[getRandomInt(0, availablePatterns.length - 1)];

  // Generate a sequence long enough for the grid
  const sequence = generateSequence(selectedPattern, size * size, level);

  // Determine hidden cells based on level
  const hiddenCellsCount = Math.min(level, 3);
  const hiddenIndices = new Set();
  while (hiddenIndices.size < hiddenCellsCount) {
    hiddenIndices.add(getRandomInt(0, size * size - 1));
  }

  let answer = {};
  const displayGrid = Array.from({ length: size }, (_, rowIdx) =>
    Array.from({ length: size }, (_, colIdx) => {
      const idx = rowIdx * size + colIdx;
      if (hiddenIndices.has(idx)) {
        answer[`${rowIdx}-${colIdx}`] = sequence[idx];
        return "?";
      }
      return sequence[idx];
    })
  );

  return {
    displayGrid,
    answer,
    metadata: {
      level,
      pattern: selectedPattern,
      size,
      hiddenCells: hiddenCellsCount,
    },
  };
}
