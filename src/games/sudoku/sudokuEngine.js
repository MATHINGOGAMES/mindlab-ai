// 🧩 Sudoku Engine - Professional Logic
const SIZE = 9;

function createEmptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

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

function removeNumbers(grid, difficulty) {
  const levels = { easy: 30, medium: 45, hard: 60 };
  const attempts = levels[difficulty] || 45;
  let cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) cells.push([r, c]);
  }
  cells = shuffle(cells);
  for (let i = 0; i < attempts; i++) {
    const [row, col] = cells[i];
    grid[row][col] = "";
  }
  return grid;
}

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
