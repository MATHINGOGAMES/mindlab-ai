import { useParams, Link } from "react-router-dom";
import Sudoku from "../games/sudoku/Sudoku";
import NeuralGrid from "../games/neuralGrid/NeuralGrid";
import { motion } from "framer-motion";

export default function Game() {
  const { type } = useParams();

  // 🧠 خريطة الألعاب (تأكد أن المفاتيح تطابق الروابط في الصفحة الرئيسية)
  const gamesMap = {
    sudoku: <Sudoku />,
    neuralGrid: <NeuralGrid />,
  };

  const currentGame = gamesMap[type];

  return (
    <div className="min-h-screen bg-black">
      {/* زر العودة للملف الشخصي أو القائمة الرئيسية */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/"
          className="text-white/50 hover:text-purple-400 transition-colors flex items-center gap-2 text-sm"
        >
          ← Back to Lab
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentGame ? (
          <div className="w-full">{currentGame}</div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gray-900/50 p-10 rounded-[2rem] border border-red-500/20 shadow-2xl shadow-red-500/5"
            >
              <h2 className="text-6xl mb-4">🚫</h2>
              <h2 className="text-3xl font-black text-white mb-2">
                Game Not Found
              </h2>
              <p className="text-gray-500 mb-6">
                عذراً، هذه اللعبة غير متوفرة حالياً في المختبر.
              </p>
              <Link
                to="/"
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg"
              >
                Return to Dashboard
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
