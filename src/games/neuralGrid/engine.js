const PATTERNS = {
  ARITHMETIC: "arithmetic",
  GEOMETRIC: "geometric",
  MIXED: "mixed",
};

function generateSequence(type, length, level) {
  const base = Math.floor(Math.random() * (level * 5)) + 2;

  switch (type) {
    case PATTERNS.ARITHMETIC: {
      const step = Math.floor(Math.random() * level) + 1;
      return Array.from({ length }, (_, i) => base + i * step);
    }

    case PATTERNS.GEOMETRIC: {
      const ratio = Math.floor(Math.random() * 3) + 2;
      return Array.from({ length }, (_, i) => base * Math.pow(ratio, i));
    }

    case PATTERNS.MIXED: {
      return Array.from({ length }, (_, i) =>
        i % 2 === 0 ? base + i * 2 : base + i * 3
      );
    }

    default:
      return [];
  }
}

export function generateGrid(level = 1, size = 3) {
  const patternTypes = Object.values(PATTERNS);
  const selectedPattern =
    patternTypes[Math.floor(Math.random() * patternTypes.length)];

  const sequence = generateSequence(selectedPattern, size * size, level);

  const grid = [];
  let index = 0;

  for (let r = 0; r < size; r++) {
    grid[r] = [];
    for (let c = 0; c < size; c++) {
      grid[r][c] = sequence[index++];
    }
  }

  const hiddenRow = Math.floor(Math.random() * size);
  const hiddenCol = Math.floor(Math.random() * size);

  const answer = grid[hiddenRow][hiddenCol];

  const displayGrid = grid.map((row, rIdx) =>
    row.map((cell, cIdx) =>
      rIdx === hiddenRow && cIdx === hiddenCol ? "?" : cell
    )
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
