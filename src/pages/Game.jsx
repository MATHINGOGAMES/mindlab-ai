import { useParams } from "react-router-dom";
import Sudoku from "../games/sudoku/Sudoku";

export default function Game() {
  const { type } = useParams();

  // 🧠 خريطة الألعاب (قابلة للتوسعة)
  const gamesMap = {
    sudoku: <Sudoku />,
    // مستقبلاً:
    // memory: <MemoryGame />,
    // puzzle: <PuzzleGame />,
  };

  return (
    <div style={{ padding: 20 }}>
      {gamesMap[type] || (
        <div style={{ textAlign: "center" }}>
          <h2>❌ Game not found</h2>
          <p>اللعبة غير موجودة</p>
        </div>
      )}
    </div>
  );
}
