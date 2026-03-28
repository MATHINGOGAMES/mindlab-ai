import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // الصفحة الرئيسية التي بها الكروت
import Game from "./pages/Game"; // الملف الذي عدلناه تواً
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route path="/" element={<Dashboard />} />

        {/* مسار الألعاب الديناميكي */}
        {/* كلمة :type هنا هي التي يستقبلها ملف Game.jsx */}
        <Route path="/game/:type" element={<Game />} />

        {/* صفحة البروفايل (إذا كانت موجودة) */}
        <Route path="/profile" element={<Profile />} />

        {/* مسار احتياطي في حال كتابة رابط خطأ */}
        <Route
          path="*"
          element={
            <div className="text-white text-center mt-20">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
