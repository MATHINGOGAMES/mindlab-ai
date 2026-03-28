import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion"; // استيراد Framer Motion
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  // 🛰️ كاشف المسار التلقائي: (لا يتغير)
  const base = window.location.hostname.includes("github.io")
    ? "/mindlab-ai"
    : "/";

  return (
    <Router basename={base}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:type" element={<Game />} />

        {/* 🌌 صفحة 404: "الثقب الأسود النجمي" */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono relative overflow-hidden">
              {/* 1. الثقب الأسود المتحرك (الخلفية البصرية) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 z-0">
                {/* الحلقة الخارجية المضيئة */}
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-[500px] h-[500px] border-4 border-dashed border-cyan-800 rounded-full blur-sm"
                />

                {/* حلقة الجاذبية الداخلية (أسرع) */}
                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-[350px] h-[350px] border-8 border-double border-cyan-500 rounded-full shadow-[0_0_60px_#14b8a6]"
                />

                {/* "أفق الحدث" الأسود المطلق في المركز */}
                <div className="absolute w-[200px] h-[200px] bg-black rounded-full shadow-[0_0_100px_#000] z-10" />
              </div>

              {/* 2. المحتوى الأمامي (Text & Button) */}
              <motion.div
                className="text-center z-10 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {/* رقم 404 المسحوب نحو المركز */}
                <motion.h1
                  animate={{
                    letterSpacing: ["0px", "20px", "0px"],
                    y: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-9xl font-black text-cyan-300 mb-2 relative"
                >
                  4<span className="text-cyan-600 animate-pulse">0</span>4
                </motion.h1>

                <p className="tracking-widest opacity-70 uppercase text-xs mb-10">
                  Critical Error: Gravitational Singularity
                </p>

                {/* زر "العودة للقاعدة" (Warp Button) */}
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0px 0px 30px #14b8a6",
                    textShadow: "0px 0px 10px #fff",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = base)}
                  className="px-10 py-4 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all duration-300 uppercase tracking-tighter font-bold flex items-center gap-2 group"
                >
                  <motion.span
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-xl"
                  >
                    🚀
                  </motion.span>
                  Return to Base Station
                  <motion.span
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    (Warp Drive Initialized)
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
