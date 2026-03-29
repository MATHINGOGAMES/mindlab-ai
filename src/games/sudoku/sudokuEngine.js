// ========================
// 🧠 Sudoku Engine (AI + Generator)
// ========================

const SIZE = 9;

// إنشاء شبكة فارغة
export function createEmptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

// خلط عشوائي
export function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// خلط باستخدام Seed (لـ Daily Puzzle)
export function seededShuffle(array, seed) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    let j = Math.floor((seed / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// التحقق من صحة الرقم
export function isValid(grid, row, col, num) {
  for (let x = 0; x < SIZE; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (grid[startRow + r][startCol + c] === num) return false;

  return true;
}

// حل السودوكو (Backtracking AI)
export function solve(grid) {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (grid[row][col] === 0) {
        for (let num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solve(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// إزالة الأرقام حسب الصعوبة
export function removeNumbers(grid, difficulty = "medium", seed = null) {
  const levels = {
    easy: 30,
    medium: 45,
    hard: 60,
  };

  let attempts = levels[difficulty] || 45;

  let cells = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) cells.push([r, c]);

  cells = seed ? seededShuffle(cells, seed) : shuffle(cells);

  for (let i = 0; i < attempts; i++) {
    const [row, col] = cells[i];
    grid[row][col] = "";
  }

  return grid;
}

// توليد لعبة عادية
export function generateSudoku(difficulty = "medium") {
  const grid = createEmptyGrid();
  solve(grid);

  const solution = grid.map((row) => [...row]);

  const puzzle = removeNumbers(
    grid.map((row) => row.map((cell) => (cell === 0 ? "" : cell))),
    difficulty
  );

  return { puzzle, solution };
}

// توليد Daily Puzzle
export function generateDailySudoku(difficulty = "medium") {
  const today = new Date();

  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const grid = createEmptyGrid();
  solve(grid);

  const solution = grid.map((row) => [...row]);

  const puzzle = removeNumbers(
    grid.map((row) => row.map((cell) => (cell === 0 ? "" : cell))),
    difficulty,
    seed
  );

  return { puzzle, solution };
}
