import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  // 🛰️ كاشف المسار التلقائي:
  // إذا كان الموقع ينتهي بـ github.io استخدم المجلد الفرعي، وإلا استخدم الجذر (لـ Vercel)
  const base = window.location.hostname.includes("github.io")
    ? "/mindlab-ai"
    : "/";

  return (
    <Router basename={base}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:type" element={<Game />} />

        {/* صفحة 404 ذكية */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
              <h1 className="text-6xl font-black text-cyan-500 mb-4 animate-pulse">
                404
              </h1>
              <p className="tracking-widest opacity-50 uppercase">
                Signal Lost - Galaxy Not Found
              </p>
              <button
                onClick={() => (window.location.href = base)}
                className="mt-8 px-8 py-3 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all duration-500 uppercase tracking-tighter font-bold"
              >
                Return to Base Station
              </button>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
