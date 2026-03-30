import { motion } from "framer-motion";
import { useGameStore } from "../core/store"; // تأكد من المسار
import { getSmartAdvice } from "../core/advisor"; // تأكد من المسار
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // 1️⃣ تنشيط useGameStore (سيتغير لونه للأزرق/الأبيض)
  const { xp, level } = useGameStore();

  // 2️⃣ تنشيط useState و getSmartAdvice
  const [advice, setAdvice] = useState(null);

  useEffect(() => {
    // استدعاء الدالة لتنشيط getSmartAdvice فعلياً
    const dailyAdvice = getSmartAdvice();
    setAdvice(dailyAdvice);
    console.log("Current Advice:", dailyAdvice);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* 3️⃣ تنشيط motion (لعمل حركة دخول) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black mb-2">
            MINDLAB <span className="text-blue-500">AI</span>
          </h1>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Level {level}</span>
            <div className="h-1 w-32 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(xp % 500) / 5}%` }}
                className="h-full bg-blue-500"
              />
            </div>
            <span>XP: {xp}</span>
          </div>
        </motion.div>

        {/* 4️⃣ تنشيط عرض النصيحة (تنشيط الـ State) */}
        {advice && (
          <div className="bg-zinc-900/50 border border-blue-500/20 p-8 rounded-[2rem] mb-10">
            <p className="text-2xl font-bold text-right mb-4" dir="rtl">
              {advice.ar}
            </p>
            <p className="text-zinc-400 italic">{advice.en}</p>
          </div>
        )}

        {/* 5️⃣ تنشيط Link (للانتقال للعبة) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/game/sudoku">
            <div className="p-8 bg-zinc-900 rounded-3xl border border-white/5 hover:border-blue-500 transition-all cursor-pointer">
              <span className="text-4xl">🧩</span>
              <h2 className="text-xl font-bold mt-4">Sudoku Master</h2>
              <p className="text-zinc-500 text-sm">تحدي السودوكو الاحترافي</p>
            </div>
          </Link>

          {/* يمكنك إضافة روابط للألعاب الأخرى هنا بنفس الطريقة */}
        </div>
      </div>
    </div>
  );
}
