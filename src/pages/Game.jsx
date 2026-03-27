import { useParams } from "react-router-dom";
import Sudoku from "../games/sudoku/Sudoku";
import NeuralGrid from "../games/neuralGrid/NeuralGrid";
export default function Game() {
  const { type } = useParams();

  // 🧠 خريطة الألعاب (قابلة للتوسعة)
  const gamesMap = {
    sudoku: <Sudoku />,
    // مستقبلاً:
    neuralGrid: <NeuralGrid />,
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
