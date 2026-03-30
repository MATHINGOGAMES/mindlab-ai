import { useParams, Link } from "react-router-dom";
import Sudoku from "../games/sudoku/Sudoku";
import NeuralGrid from "../games/neuralGrid/NeuralGrid";
import MemoryAI from "../games/memory/MemoryAI";
import GeometryMemory from "../games/geometry/GeometryMemory"; // 👈 Import the new Geometry game
import NeonMathAdvancedPro from "../games/NeonMathAdvancedPro/NeonMathAdvancedPro";
import { motion } from "framer-motion";

export default function Game() {
  const { type } = useParams();

  // 🧠 Updated Game Mapping Terminal
  const gamesMap = {
    sudoku: <Sudoku />,
    neuralGrid: <NeuralGrid />,
    memory: <MemoryAI />,
    geometry: <GeometryMemory />, // 👈 Link the new isolated Geometry module
    NeonMathAdvancedPro: <NeonMathAdvancedPro />,
  };

  const currentGame = gamesMap[type];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative selection:bg-purple-500/30">
      {/* Sleek Navigation Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="text-white/30 hover:text-purple-400 transition-all flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            ←
          </span>
          Back to Terminal
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
          /* 404 Experiment Not Found UI */
          <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900/30 p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-2xl shadow-2xl max-w-md"
            >
              <h2 className="text-6xl mb-8 animate-pulse">🔍</h2>
              <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">
                Experiment Not Found
              </h2>
              <p className="text-gray-500 mb-10 text-[11px] leading-relaxed italic uppercase tracking-widest">
                Access Denied. This digital experiment is currently not listed
                in the MindLab registry.
              </p>
              <Link
                to="/"
                className="inline-block px-12 py-5 bg-white text-black text-[10px] font-black rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95 uppercase tracking-[0.2em]"
              >
                Return to Dashboard
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] pointer-events-none rounded-full" />
    </div>
  );
}
