import { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  const base = window.location.hostname.includes("github.io")
    ? "/mindlab-ai"
    : "/";

  // 🎵 إدارة الصوت
  const [isPlaying, setIsPlaying] = useState(false);
  // تأكد من مطابقة اسم الملف هنا مع ما وضعته في مجلد public
  const audioRef = useRef(new Audio(`${base}rain-suite-11.mp3`));
  audioRef.current.loop = true;

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play blocked by browser"));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Router basename={base}>
      {/* 🎧 زر التحكم في الموسيقى (يظهر في جميع الصفحات) */}
      <div className="fixed top-6 right-6 z-[100]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className={`group flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-500 ${
            isPlaying
              ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              : "border-white/20 bg-black/40 opacity-60 hover:opacity-100"
          }`}
        >
          {/* نص توضيحي يظهر عند الحوّم بالماوس */}
          <span className="text-[10px] font-black uppercase tracking-tighter text-cyan-500 hidden group-hover:block">
            {isPlaying ? "Mute Ambient" : "Activate Sound"}
          </span>

          {/* أيقونة الأمواج الصوتية المتحركة */}
          <div className="flex gap-1 items-end h-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={
                  isPlaying ? { height: [2, 12, 6, 12, 2] } : { height: 2 }
                }
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                className={`w-1 rounded-full ${
                  isPlaying ? "bg-cyan-400" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </motion.button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:type" element={<Game />} />

        {/* صفحة 404 (كود الثقب الأسود) */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
              <h1 className="text-9xl font-black text-cyan-500 animate-pulse z-10">
                404
              </h1>
              <p className="z-10 opacity-50 uppercase tracking-[0.5em] text-xs mt-4">
                Signal Lost in Deep Space
              </p>
              <button
                onClick={() => (window.location.href = base)}
                className="z-10 mt-10 px-6 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all"
              >
                RETURN TO BASE
              </button>
              {/* تأثير الثقب الأسود البسيط خلف النص */}
              <div className="absolute w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px]" />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
