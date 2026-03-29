"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "../../core/sounds";

// --- المحرك المستقل الخاص بالهندسة ---
const GEOMETRY_DATABASE = [
  { shape: "Circle", property: "Perimeter", formula: "2πr", icon: "◯" },
  { shape: "Circle", property: "Area", formula: "πr²", icon: "◯" },
  { shape: "Triangle", property: "Area", formula: "½ × b × h", icon: "△" },
  { shape: "Square", property: "Area", formula: "s²", icon: "□" },
  { shape: "Rectangle", property: "Area", formula: "L × W", icon: "▭" },
  { shape: "Trapezoid", property: "Area", formula: "½(a+b)h", icon: "⬠" },
  { shape: "Cylinder", property: "Volume", formula: "πr²h", icon: "筒" },
  { shape: "Pythagorean", property: "Theorem", formula: "a²+b²=c²", icon: "⊿" }
];

export default function GeometryMemory() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [status, setStatus] = useState("loading");
  const [level, setLevel] = useState(1);

  // توليد التحدي الهندسي
  const initGame = useCallback(() => {
    setStatus("loading");
    // اختيار 4 أشكال عشوائية لكل مستوى
    const selection = [...GEOMETRY_DATABASE]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const gameCards = [];
    selection.forEach((item, index) => {
      const matchId = `match-${index}`;
      // بطاقة السؤال: اسم الشكل وخاصيته
      gameCards.push({
        id: `q-${index}`,
        content: `${item.icon} ${item.shape}`,
        subContent: item.property,
        matchId,
        type: "question"
      });
      // بطاقة الجواب: القانون الرياضي
      gameCards.push({
        id: `a-${index}`,
        content: item.formula,
        subContent: "Formula",
        matchId,
        type: "answer"
      });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setSolved([]);
    setStatus("playing");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame, level]);

  const handleCardClick = (idx) => {
    if (status !== "playing" || flipped.includes(idx) || solved.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setStatus("checking");
      const [c1, c2] = [cards[newFlipped[0]], cards[newFlipped[1]]];

      if (c1.matchId === c2.matchId) {
        playSound("correct");
        setSolved(prev => [...prev, ...newFlipped]);
        setFlipped([]);
        setStatus("playing");
      } else {
        playSound("wrong");
        setTimeout(() => {
          setFlipped([]);
          setStatus("playing");
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && solved.length === cards.length) {
      playSound("win");
      setTimeout(() => setLevel(l => l + 1), 2000);
    }
  }, [solved, cards]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 flex flex-col items-center font-sans">
      
      <div className="mb-12 text-center">
        <h1 className="text-2xl font-black text-orange-500 tracking-tighter italic">GEOMETRY LAB</h1>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Match Shapes with their Formulas</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl w-full">
        {cards.map((card, idx) => (
          <div 
            key={card.id}
            className="relative aspect-[3/4] cursor-pointer"
            onClick={() => handleCardClick(idx)}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: flipped.includes(idx) || solved.includes(idx) ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Back Face */}
              <div className="absolute inset-0 bg-zinc-900 border border-orange-500/20 rounded-2xl flex items-center justify-center backface-hidden shadow-2xl">
                <div className="text-orange-500/20 text-4xl">?</div>
              </div>

              {/* Front Face */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 px-2 text-center shadow-2xl ${
                  solved.includes(idx) ? "bg-green-500/10 border-green-500 text-green-400" : "bg-zinc-800 border-orange-500 text-white"
                }`}
                style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
              >
                <span className="text-xl sm:text-2xl mb-1">{card.content}</span>
                <span className="text-[9px] uppercase font-black opacity-50 tracking-tighter">{card.subContent}</span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex gap-4">
        <div className="px-6 py-2 bg-zinc-900 border border-white/5 rounded-full text-xs font-bold">
          LEVEL <span className="text-orange-500">{level}</span>
        </div>
        <button 
          onClick={() => { setLevel(1); initGame(); }}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-full text-xs font-bold transition-colors"
        >
          RESET LAB
        </button>
      </div>
    </div>
  );
}