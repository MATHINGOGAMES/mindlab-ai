import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// 1. استيراد الصفحة الرئيسية (تأكد من أن اسم الملف هو Home.jsx في مجلد pages)
import Home from "./pages/Home";
import Game from "./pages/Game";
import Profile from "./pages/Profile";

function App() {
  return (
    // 2. إضافة الـ basename لضمان عمل الروابط بشكل صحيح على GitHub Pages
    <Router basename="/mindlab-ai">
      <Routes>
        {/* الصفحة الرئيسية - تم تغييرها من Dashboard إلى Home */}
        <Route path="/" element={<Home />} />

        {/* مسار الألعاب الديناميكي */}
        <Route path="/game/:type" element={<Game />} />

        {/* صفحة البروفايل */}
        <Route path="/profile" element={<Profile />} />

        {/* مسار احتياطي */}
        <Route
          path="*"
          element={
            <div className="text-white text-center mt-20 font-mono">
              <h1 className="text-4xl mb-4 text-red-500">404</h1>
              <p>CONNECTION LOST - PAGE NOT FOUND</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
