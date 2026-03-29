import { useParams, Link } from "react-router-dom";
import Sudoku from "../games/sudoku/Sudoku";
import NeuralGrid from "../games/neuralGrid/NeuralGrid";
import MemoryAI from "../games/memory/MemoryAI"; // 👈 استيراد اللعبة الجديدة
import { motion } from "framer-motion";

export default function Game() {
  const { type } = useParams();

  // 🧠 خريطة الألعاب المحدثة
  const gamesMap = {
    sudoku: <Sudoku />,
    neuralGrid: <NeuralGrid />,
    memory: <MemoryAI />, // 👈 إضافة مفتاح اللعبة الجديدة
  };

  const currentGame = gamesMap[type];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* زر العودة الأنيق */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="text-white/30 hover:text-purple-400 transition-all flex items-center gap-2 text-xs uppercase tracking-widest font-bold group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Lab
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full"
      >
        {currentGame ? (
          <div className="w-full">{currentGame}</div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900/30 p-12 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl"
            >
              <h2 className="text-5xl mb-6">🔍</h2>
              <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                Experiment Not Found
              </h2>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                عذراً، هذا الاختبار الرقمي غير مدرج في سجلات المختبر حالياً.
              </p>
              <Link
                to="/"
                className="inline-block px-10 py-4 bg-white text-black text-xs font-black rounded-2xl hover:bg-purple-500 hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest"
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