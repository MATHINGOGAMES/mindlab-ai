"use client";
import { motion } from "framer-motion";

export default function IDCard({ type = "H" }) {
  // إعدادات الوحوش بناءً على الـ Type المرسل من الداشبورد
  const monsterConfig = {
    H: {
      name: "H-Zero",
      image: "/h-zero.png",
      atomicNo: "01",
      tag: "Reactive Nonmetal",
      colorClass: "text-cyan-400",
      borderClass: "border-cyan-500/20",
      glowClass: "bg-cyan-500",
      label: "Hydrogen",
    },
    He: {
      name: "He-Double",
      image: "/He-Double.png", // تأكد من وجود الصورة في مجلد public
      atomicNo: "02",
      tag: "Noble Gas Class",
      colorClass: "text-orange-400",
      borderClass: "border-orange-500/20",
      glowClass: "bg-orange-500",
      label: "Helium",
    },
    Li: {
      name: "Li-Triple",
      image: "/Li-Triple.png", // تأكد من وضع صورة الوحش الثالث في مجلد public
      atomicNo: "03",
      tag: "Alkali Metal",
      colorClass: "text-purple-400",
      borderClass: "border-purple-500/20",
      glowClass: "bg-purple-500",
      label: "Lithium",
    },
  };

  const monster = monsterConfig[type] || monsterConfig.H;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-64 h-[400px] bg-[#0a0a0a] border ${monster.borderClass} rounded-[2.5rem] overflow-hidden group shadow-2xl transition-all duration-500`}
    >
      {/* تأثير التوهج العلوي */}
      <div
        className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 ${monster.glowClass}`}
        style={{ clipPath: "circle(50% at 50% 0%)" }}
      />

      {/* منطقة الصورة */}
      <div className="relative h-3/5 w-full p-4">
        <div className="w-full h-full rounded-[2rem] overflow-hidden border border-white/5 relative bg-zinc-900/50">
          <img
            src={monster.image}
            alt={monster.name}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
            <p
              className={`text-[8px] font-black uppercase tracking-widest ${monster.colorClass}`}
            >
              {monster.tag}
            </p>
          </div>
        </div>
      </div>

      {/* بيانات الوحش */}
      <div className="p-6 pt-0">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3
              className={`text-2xl font-black italic tracking-tighter transition-colors ${monster.colorClass}`}
            >
              {monster.name}
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
              Atomic_No: {monster.atomicNo}
            </p>
          </div>
          <div className="text-[10px] font-bold text-zinc-600 tracking-tighter uppercase">
            {monster.label}
          </div>
        </div>

        {/* شريط الطاقة (Attribute) */}
        <div className="space-y-2">
          <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: isNaN(type) ? "85%" : "100%" }}
              className={`h-full shadow-[0_0_10px] ${monster.glowClass}`}
              style={{ width: type === "H" ? "70%" : "95%" }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-zinc-500 font-bold uppercase tracking-widest">
            <span>Core Stability</span>
            <span className={monster.colorClass}>
              {type === "H" ? "70%" : "95%"}
            </span>
          </div>
        </div>

        <button
          className={`mt-6 w-full py-3 bg-zinc-900/50 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all group-hover:border-${monster.colorClass}/30`}
        >
          Sync_Database
        </button>
      </div>
    </motion.div>
  );
}
