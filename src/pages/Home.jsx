import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  // 🎮 قائمة الألعاب المتاحة
  const games = [
    {
      name: "Sudoku Master",
      path: "/game/sudoku",
      emoji: "🧩",
      color: "from-green-400 to-blue-500",
      desc: "التحدي الكلاسيكي للأرقام",
    },
    {
      name: "Neural Grid",
      path: "/game/neuralGrid",
      emoji: "🧠",
      color: "from-purple-500 to-pink-500",
      desc: "اختبر ذكاءك في الأنماط الرقمية",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      {/* العنوان الرئيسي */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          MIND<span className="text-purple-500 text-shadow-glow">LAB</span>
        </h1>
        <p className="text-gray-400 text-lg font-light tracking-widest uppercase">
          Choose a game and train your brain
        </p>
      </motion.div>

      {/* حاوية الكروت */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {games.map((game, index) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={game.path} className="group block">
              <div className="relative overflow-hidden bg-gray-900 border border-white/10 p-8 rounded-[2.5rem] transition-all hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                {/* تأثير خلفية الكارت */}
                <div
                  className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${game.color} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity`}
                />

                <div className="flex items-center gap-6">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {game.emoji}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-purple-400 transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-gray-500 text-sm italic">{game.desc}</p>
                  </div>
                </div>

                {/* زر التشغيل الصغير */}
                <div className="mt-6 flex justify-end">
                  <span className="text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                    Start Game →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* التذييل */}
      <footer className="mt-20 text-gray-600 text-xs font-mono">
        © 2024 MINDLAB AI TERMINAL v2.0
      </footer>
    </div>
  );
}
