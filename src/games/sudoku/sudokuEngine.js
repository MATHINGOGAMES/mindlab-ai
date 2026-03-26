// 🧩 توليد Sudoku احترافي

const SIZE = 9;

// 🔢 إنشاء شبكة فارغة
function createEmptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

// 🎲 خلط الأرقام
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ✅ التحقق من صحة الرقم
function isValid(grid, row, col, num) {
  for (let x = 0; x < SIZE; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (grid[r + startRow][c + startCol] === num) return false;
    }
  }

  return true;
}

// 🧠 حل Sudoku (Backtracking)
function solve(grid) {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (let num of numbers) {
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

// ✂️ حذف أرقام حسب الصعوبة
function removeNumbers(grid, difficulty = "medium") {
  const attempts = {
    easy: 35,
    medium: 45,
    hard: 55,
  };

  let count = attempts[difficulty] || 45;

  while (count > 0) {
    const row = Math.floor(Math.random() * SIZE);
    const col = Math.floor(Math.random() * SIZE);

    if (grid[row][col] !== 0) {
      grid[row][col] = "";
      count--;
    }
  }

  return grid;
}

// 🚀 الدالة الرئيسية
export function generateSudoku(difficulty = "medium") {
  const grid = createEmptyGrid();

  solve(grid); // نولّد الحل الكامل

  const solution = grid.map((row) => [...row]);

  const puzzle = removeNumbers(
    grid.map((row) => [...row]),
    difficulty
  );

  return {
    puzzle,
    solution,
  };
}
