// 🎮 AtomicArena Pro - Enhanced Version (English & Full-Screen Distribution)
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useGameStore } from "../../core/store";

// 🎨 Particle Effect System
const ParticleEffect = ({ x, y, color, count = 12 }) => {
  return [...Array(count)].map((_, i) => (
    <motion.div
      key={i}
      initial={{ x, y, scale: 1, opacity: 1 }}
      animate={{
        x: x + (Math.random() - 0.5) * 150,
        y: y + (Math.random() - 0.5) * 150,
        scale: 0,
        opacity: 0,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`absolute w-2 h-2 rounded-full ${color}`}
      style={{ pointerEvents: "none" }}
    />
  ));
};

// ⚛️ Enhanced Atom Component with Orbital Effects
const EnhancedAtom = ({ atom, onClick, isSelected }) => {
  const controls = useAnimation();
  const atomStyles = {
    H: { color: "cyan", glow: "#06b6d4", electrons: 1 },
    O: { color: "red", glow: "#ef4444", electrons: 2 },
    C: { color: "gray", glow: "#9ca3af", electrons: 2 },
    N: { color: "blue", glow: "#3b82f6", electrons: 2 },
  };
  const style = atomStyles[atom.type] || atomStyles.C;

  return (
    <motion.div
      initial={{ y: -100, x: `${atom.x}%`, opacity: 0, scale: 0.8 }}
      animate={{ y: "100vh", opacity: 1, scale: 1 }}
      exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 7, ease: "linear" }}
      whileHover={{ scale: 1.15, zIndex: 50 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick(atom)}
      className="absolute cursor-pointer group"
      style={{ left: 0, top: 0 }}
    >
      {/* Glow Effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle, ${style.glow}40, transparent 70%)`,
        }}
      />
      {/* Atom Core */}
      <div
        className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center
        transition-all duration-300 group-hover:shadow-[0_0_40px_${style.glow}]`}
        style={{
          borderColor: style.glow,
          background: `radial-gradient(circle at 30% 30%, ${style.glow}30, transparent)`,
          boxShadow: isSelected ? `0 0 30px ${style.glow}` : "none",
        }}
      >
        {/* Orbiting Electrons */}
        {[...Array(style.electrons)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-white shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
            style={{
              transformOrigin: `0 ${28 + i * 8}px`,
              top: "50%",
              left: "50%",
              marginTop: -6,
              marginLeft: -6,
            }}
          />
        ))}
        <span className="text-xl font-black text-white relative z-10">
          {atom.type}
        </span>
      </div>
      {/* Type Indicator on Hover */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
        transition-opacity bg-black/80 px-3 py-1 rounded-full text-xs whitespace-nowrap border border-white/20"
      >
        {atom.type === "H" && "Hydrogen • 1.008 u"}
        {atom.type === "O" && "Oxygen • 15.999 u"}
        {atom.type === "C" && "Carbon • 12.011 u"}
        {atom.type === "N" && "Nitrogen • 14.007 u"}
      </div>
    </motion.div>
  );
};

// 🎯 Mission Progress Component
const MissionProgress = ({ mission, basket, onComplete }) => {
  const progress = useMemo(() => {
    const required = {
      ...mission.formula.reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {}),
    };
    const collected = {
      ...basket.reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {}),
    };
    return Object.entries(required).map(([element, count]) => ({
      element,
      required: count,
      collected: collected[element] || 0,
      complete: (collected[element] || 0) >= count,
    }));
  }, [mission, basket]);

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {progress.map((item, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center
          transition-all duration-300 ${
            item.complete
              ? "bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-cyan-400 shadow-[0_0_25px_cyan]"
              : "border-white/20 bg-white/5"
          }`}
        >
          <span
            className={`text-xl font-black ${
              item.complete ? "text-cyan-300" : "text-white/60"
            }`}
          >
            {item.element}
          </span>
          <span className="text-xs text-white/70">
            {item.collected}/{item.required}
          </span>
          {item.complete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs"
            >
              ✓
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// 🏆 Achievement Badge Component
const AchievementBadge = ({ unlocked, title, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
      unlocked
        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/50"
        : "bg-white/5 border-white/10 opacity-50"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span
      className={`text-sm font-medium ${
        unlocked ? "text-amber-300" : "text-white/40"
      }`}
    >
      {title}
    </span>
  </motion.div>
);

// 🎮 Main Enhanced Component
export default function AtomicArenaPro() {
  const { addXP, playerLevel, unlockAchievement } = useGameStore();

  // 🎮 Advanced Game State
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");
  const [atoms, setAtoms] = useState([]);
  const [basket, setBasket] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentMission, setCurrentMission] = useState(0);

  // 🧪 Educational Molecule Missions
  const missions = useMemo(
    () => [
      {
        id: 0,
        name: "Water",
        formula: ["H", "H", "O"],
        xp: 100,
        description: "The first molecule in the universe!",
      },
      {
        id: 1,
        name: "Carbon Dioxide",
        formula: ["C", "O", "O"],
        xp: 150,
        description: "Essential for photosynthesis",
      },
      {
        id: 2,
        name: "Ammonia",
        formula: ["N", "H", "H", "H"],
        xp: 200,
        description: "A key compound in fertilizers",
      },
      {
        id: 3,
        name: "Methane",
        formula: ["C", "H", "H", "H", "H"],
        xp: 250,
        description: "Clean fuel of the future",
      },
      {
        id: 4,
        name: "Glucose",
        formula: [
          "C",
          "C",
          "C",
          "C",
          "C",
          "C",
          "O",
          "O",
          "O",
          "O",
          "O",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
        ],
        xp: 500,
        description: "The primary energy source for living organisms",
        boss: true,
      },
    ],
    []
  );

  const mission = missions[currentMission] || missions[0];

  // 🔊 Advanced Sound System
  const sounds = useRef({
    collect: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-click-1112.mp3"
    ),
    success: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-magical-bright-win-2819.mp3"
    ),
    error: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"
    ),
    combo: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3"
    ),
    background: new Audio(
      "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3"
    ),
  });

  useEffect(() => {
    sounds.current.background.loop = true;
    sounds.current.background.volume = 0.3;
  }, []);

  // 🌌 Dynamic Space Background
  const StarField = useCallback(
    () => (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: [null, Math.random() * -20 - 10],
              opacity: [null, Math.random() * 0.3 + 0.7],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    ),
    []
  );

  // ⚡ Smart Atom Generation Engine
  useEffect(() => {
    if (!gameStarted || gamePaused) return;
    const difficultySettings = {
      easy: { interval: 2500, speed: 8, types: ["H", "O"] },
      normal: { interval: 1800, speed: 7, types: ["H", "O", "C"] },
      hard: { interval: 1200, speed: 6, types: ["H", "O", "C", "N"] },
      expert: {
        interval: 800,
        speed: 5,
        types: ["H", "O", "C", "N", "S", "P"],
      },
    };
    const settings = difficultySettings[difficulty];

    const interval = setInterval(() => {
      const newAtom = {
        id: crypto.randomUUID(),
        type: settings.types[Math.floor(Math.random() * settings.types.length)],
        // 🌐 Updated to distribute across the FULL screen width (2% to 98% to avoid edge clipping)
        x: Math.random() * 96 + 2,
        speed: settings.speed + Math.random() * 2,
        isSpecial: Math.random() > 0.95,
      };
      setAtoms((prev) => [...prev.slice(-15), newAtom]);
    }, settings.interval);
    return () => clearInterval(interval);
  }, [gameStarted, gamePaused, difficulty]);

  // 🎯 Atom Interaction Logic
  const handleAtomClick = useCallback(
    (atom) => {
      sounds.current.collect.currentTime = 0;
      sounds.current.collect.play().catch(() => {});

      const newParticle = {
        id: crypto.randomUUID(),
        x: atom.x,
        y: 50,
        color:
          atom.type === "H"
            ? "bg-cyan-400"
            : atom.type === "O"
            ? "bg-red-400"
            : "bg-gray-400",
      };
      setParticles((prev) => [...prev, newParticle]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 600);

      const newBasket = [...basket, atom.type];
      const required = mission.formula;

      const isComplete =
        required.every(
          (element) =>
            newBasket.filter((x) => x === element).length >=
            required.filter((x) => x === element).length
        ) && newBasket.length === required.length;

      if (isComplete) {
        sounds.current.success.play();
        const comboBonus = Math.floor(combo * 10);
        const totalXP = mission.xp + comboBonus;
        setScore((s) => s + totalXP);
        addXP(totalXP);
        setCombo((c) => c + 1);
        if (combo >= 2) sounds.current.combo.play();

        if (combo >= 3) unlockAchievement("combo-master");
        if (currentMission === missions.length - 1)
          unlockAchievement("molecule-master");

        setTimeout(() => {
          if (currentMission < missions.length - 1) {
            setCurrentMission((prev) => prev + 1);
          }
          setBasket([]);
        }, 1500);
      } else if (newBasket.length > required.length) {
        sounds.current.error.play();
        setCombo(0);
        setBasket([]);
      } else {
        setBasket(newBasket);
      }

      setAtoms((prev) => prev.filter((a) => a.id !== atom.id));
    },
    [basket, mission, combo, currentMission, missions, addXP, unlockAchievement]
  );

  // ⌨️ Keyboard Controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setGamePaused((p) => !p);
      if (e.key === " " && gameStarted && !gamePaused) {
        const nearest = atoms[0];
        if (nearest) handleAtomClick(nearest);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameStarted, gamePaused, atoms, handleAtomClick]);

  // 🎬 Professional Start Screen
  if (!gameStarted) {
    return (
      <div className="h-screen bg-[#020202] text-white overflow-hidden relative font-mono">
        <StarField />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400
              bg-clip-text text-transparent mb-4 animate-pulse"
            >
              ATOMIC ARENA
            </h1>
            <p className="text-xl text-white/70 max-w-md mx-auto">
              Build molecules, discover chemistry, and achieve the impossible!
              🧪⚛️
            </p>
          </motion.div>

          <div className="flex gap-3 mb-8 flex-wrap justify-center">
            {["easy", "normal", "hard", "expert"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-5 py-2 rounded-full border-2 font-bold uppercase text-sm transition-all ${
                  difficulty === level
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_30px_cyan]"
                    : "border-white/30 hover:border-cyan-400/50 hover:bg-white/10"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setGameStarted(true);
              setShowTutorial(true);
              sounds.current.background.play().catch(() => {});
            }}
            className="group relative px-16 py-5 bg-gradient-to-r from-cyan-500 to-purple-600
              text-white font-black text-xl rounded-full overflow-hidden
              shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:shadow-[0_0_80px_rgba(139,92,246,0.8)]
              transition-all duration-300"
          >
            <span className="relative z-10">🚀 START REACTION</span>
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.button>

          <div className="mt-12 grid grid-cols-3 gap-6 text-center text-sm text-white/50">
            <div>
              <div className="text-2xl mb-1">🎯</div>
              <div>Capture Atoms</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🧬</div>
              <div>Build Molecules</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🏆</div>
              <div>Earn Points</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🎮 Main Game Interface
  return (
    <div className="h-screen bg-[#020202] text-white overflow-hidden relative font-mono select-none">
      <StarField />
      <AnimatePresence>
        {particles.map((p) => (
          <ParticleEffect key={p.id} x={`${p.x}%`} y={p.y} color={p.color} />
        ))}
      </AnimatePresence>

      {/* Top Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setGamePaused((p) => !p)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            {gamePaused ? "▶" : "⏸"}
          </button>
          <div className="px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <span className="text-xs text-white/60 uppercase">Level</span>
            <span className="ml-2 font-bold text-cyan-400">{playerLevel}</span>
          </div>
        </div>
        <div className="text-right">
          <motion.div
            key={combo}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className={`text-2xl font-black ${
              combo > 2 ? "text-amber-400 animate-pulse" : "text-cyan-400"
            }`}
          >
            {score.toLocaleString()} XP
            {combo > 1 && <span className="ml-2 text-lg">🔥 x{combo}</span>}
          </motion.div>
          <div className="text-xs text-white/40 uppercase tracking-wider">
            Total Energy
          </div>
        </div>
      </div>

      {/* Mission Panel */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 text-center max-w-2xl px-4">
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-sm text-cyan-400/80 uppercase tracking-[0.3em] mb-2">
            Synthesis Protocol
          </h2>
          <h1
            className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 to-purple-300
            bg-clip-text text-transparent"
          >
            {mission.name}
          </h1>
          <p className="text-white/50 text-sm mt-1">{mission.description}</p>
          {mission.boss && (
            <span
              className="inline-block mt-2 px-3 py-1 bg-red-500/20 border border-red-400/50
              rounded-full text-xs text-red-300 animate-pulse"
            >
              ⚠️ BOSS MOLECULE
            </span>
          )}
        </motion.div>
        <MissionProgress mission={mission} basket={basket} />
        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentMission / missions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Play Area */}
      <div className="relative w-full h-full pt-32 pb-20">
        <AnimatePresence>
          {atoms.map((atom) => (
            <EnhancedAtom
              key={atom.id}
              atom={atom}
              onClick={handleAtomClick}
              isSelected={
                basket.includes(atom.type) &&
                basket.filter((x) => x === atom.type).length <=
                  mission.formula.filter((x) => x === atom.type).length
              }
            />
          ))}
        </AnimatePresence>
        {basket.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30
            flex gap-2 px-6 py-3 bg-black/60 backdrop-blur-sm rounded-2xl border border-white/20"
          >
            {basket.map((el, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30
                border border-cyan-400/50 flex items-center justify-center font-bold text-lg"
              >
                {el}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Achievement Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 flex-wrap justify-center px-4">
        <AchievementBadge
          unlocked={score >= 500}
          title="First Molecule"
          icon="🧪"
        />
        <AchievementBadge
          unlocked={combo >= 3}
          title="Combo Master"
          icon="🔥"
        />
        <AchievementBadge
          unlocked={currentMission >= 2}
          title="Chemist"
          icon="⚗️"
        />
        <AchievementBadge
          unlocked={difficulty === "expert"}
          title="Expert Mode"
          icon="💎"
        />
      </div>

      {/* Pause Menu */}
      <AnimatePresence>
        {gamePaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-white/20 text-center max-w-sm mx-4">
              <h3 className="text-2xl font-black mb-6">⏸ PAUSED</h3>
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setGamePaused(false)}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors"
                >
                  ▶ Resume
                </button>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGamePaused(false);
                    setScore(0);
                    setBasket([]);
                    setCurrentMission(0);
                  }}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 font-bold rounded-xl transition-colors"
                >
                  🔄 Restart
                </button>
                <button
                  onClick={() =>
                    setDifficulty((d) => {
                      const levels = ["easy", "normal", "hard", "expert"];
                      return levels[(levels.indexOf(d) + 1) % levels.length];
                    })
                  }
                  className="w-full py-3 bg-white/10 hover:bg-white/20 font-bold rounded-xl transition-colors text-sm"
                >
                  🎚 Difficulty: {difficulty}
                </button>
              </div>
              <p className="text-xs text-white/40">Press ESC to resume</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && gameStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-cyan-900/50 to-purple-900/50 p-6 rounded-3xl
              border border-cyan-400/30 max-w-md mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-3">How to Play?</h3>
              <ul className="text-left text-sm text-white/70 space-y-2 mb-6">
                <li>• Click falling atoms to capture them</li>
                <li>• Collect the required atoms to build the molecule</li>
                <li>• Avoid collecting extra atoms or you'll lose progress</li>
                <li>• Maintain combos for bonus rewards! 🔥</li>
              </ul>
              <button
                onClick={() => setShowTutorial(false)}
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-colors"
              >
                Got it! 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
