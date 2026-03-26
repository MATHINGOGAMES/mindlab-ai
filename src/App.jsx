import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Navbar from "./components/Navbar";

// Optional: صفحة 404
function NotFound() {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>❌ Page not found</h2>
      <p>الصفحة التي تبحث عنها غير موجودة</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar ثابت أعلى كل الصفحات */}
      <Navbar />

      {/* Main Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:type" element={<Game />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
