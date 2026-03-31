import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  // 🎮 Game Roster (Updated with Geometry Lab)
  const games = [
    {
      name: "Word Catcher",
      path: "/game/WordCatcher",
      emoji: "🎯",
      color: "from-green-400 to-blue-500",
      desc: "The classic challenge of numbers and logic.",
    },
    {
      name: "Sudoku Master",
      path: "/game/sudoku",
      emoji: "🧩",
      color: "from-green-400 to-blue-500",
      desc: "The classic challenge of numbers and logic.",
    },
    {
      name: "Neural Grid",
      path: "/game/neuralGrid",
      emoji: "🧠",
      color: "from-purple-500 to-pink-500",
      desc: "Discover numeric patterns with AI precision.",
    },
    {
      name: "Memory AI",
      path: "/game/memory",
      emoji: "🔋",
      color: "from-yellow-400 to-orange-500",
      desc: "Match arithmetic operations with accuracy.",
    },
    {
      name: "Geometry Lab",
      path: "/game/geometry",
      emoji: "📐",
      color: "from-orange-500 to-red-600",
      desc: "Bridge visual shapes with geometric laws.",
    },
    {
      name: "Math Advance",
      path: "/game/NeonMathAdvancedPro",
      emoji: "⚡",
      color: "from-green-500 to-red-600",
      desc: "Bridge visual shapes with geometric laws.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-purple-500/30">
      {/* 🎵 Audio Credits Section */}
      <div className="fixed bottom-4 left-6 z-50 pointer-events-none">
        <p className="text-[9px] text-cyan-500/30 font-mono tracking-[0.2em] uppercase leading-tight italic">
          Ambient Sound: "Rain Suite Part 11" by Chad Crouch
          <br />
          Source: Free Music Archive | License: CC BY-NC
        </p>
      </div>

      {/* Main Terminal Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          MIND
          <span className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            LAB
          </span>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-8 bg-purple-500/50"></div>
          <p className="text-gray-500 text-xs md:text-sm font-light tracking-[0.4em] uppercase">
            Cognitive Training Terminal
          </p>
          <div className="h-[1px] w-8 bg-purple-500/50"></div>
        </div>
      </motion.div>

      {/* Enhanced Game Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {games.map((game, index) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link to={game.path} className="group block h-full">
              <div className="relative h-full overflow-hidden bg-gray-900/40 border border-white/5 p-8 rounded-[2.5rem] transition-all duration-500 hover:border-purple-500/30 hover:bg-gray-900/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                {/* Background Glow Effect */}
                <div
                  className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${game.color} opacity-0 blur-3xl group-hover:opacity-20 transition-opacity duration-700`}
                />

                <div className="flex flex-col items-center text-center gap-6">
                  <span className="text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-lg">
                    {game.emoji}
                  </span>
                  <div>
                    <h3 className="text-xl font-black mb-2 group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                      {game.name}
                    </h3>
                    <p className="text-gray-500 text-[11px] leading-relaxed max-w-[180px] mx-auto italic">
                      {game.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-purple-400 transition-colors">
                    Initialize Core →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Technical Footer */}
      <footer className="mt-16 text-gray-700 text-[10px] font-mono tracking-[0.5em] flex flex-col items-center gap-2">
        <div className="w-12 h-[1px] bg-gray-800"></div>© 2026 MINDLAB AI
        TERMINAL v2.6.0
      </footer>

      {/* Technical Background Touches */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
