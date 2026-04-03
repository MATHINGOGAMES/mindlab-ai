import { useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";

// استيراد الصفحات - تأكد من مطابقة أسماء الملفات في مجلد pages
import Dashboard from "./pages/dashboard";
import Game from "./pages/Game";
import Home from "./pages/Home"; // اختياري إذا أردت الاحتفاظ بها بمسار مختلف

function App() {
  const base = window.location.hostname.includes("github.io")
    ? "/mindlab-ai"
    : "/";

  // 🎵 إحصائيات وإدارة الصوت
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(`${base}rain-suite-11.mp3`));
  audioRef.current.loop = true;

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) =>
          console.log("Audio play blocked by browser. Interaction required.")
        );
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Router basename={base}>
      {/* 🎧 Music Controller - يظهر في جميع الصفحات */}
      <div className="fixed top-6 right-6 z-[100]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMusic}
          className={`group flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-500 ${
            isPlaying
              ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.2)]"
              : "border-white/10 bg-black/60 opacity-40 hover:opacity-100"
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hidden group-hover:block">
            {isPlaying ? "Mute System" : "Initialize Sound"}
          </span>

          <div className="flex gap-1 items-end h-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={
                  isPlaying ? { height: [2, 12, 6, 12, 2] } : { height: 2 }
                }
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                className={`w-1 rounded-full ${
                  isPlaying ? "bg-cyan-400" : "bg-zinc-600"
                }`}
              />
            ))}
          </div>
        </motion.button>
      </div>

      <Routes>
        {/* 1. الصفحة الرئيسية الآن هي الداشبورد الذكي */}
        <Route path="/" element={<Dashboard />} />

        {/* 2. صفحة الألعاب الموحدة */}
        <Route path="/games/:type" element={<Game />} />

        {/* 3. (اختياري) إذا أردت الوصول للواجهة القديمة عبر رابط /hub */}
        <Route path="/hub" element={<Home />} />

        {/* 4. صفحة الخطأ 404 بنظام الثقب الأسود */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden font-mono">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent opacity-50" />
              <h1 className="text-9xl font-black text-cyan-500 animate-pulse z-10 tracking-tighter">
                404
              </h1>
              <p className="z-10 opacity-40 uppercase tracking-[0.6em] text-[10px] mt-4 font-bold">
                Critical Error: Sector Not Found
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => (window.location.href = base)}
                className="z-10 mt-12 px-8 py-3 border border-cyan-500/30 text-cyan-500 text-[10px] font-black tracking-widest hover:bg-cyan-500 hover:text-black transition-all rounded-full"
              >
                RE-ROUTE TO MAIN_CORE
              </motion.button>
              <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
