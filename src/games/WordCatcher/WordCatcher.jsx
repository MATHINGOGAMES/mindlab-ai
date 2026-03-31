import React, { useRef, useEffect, useState, useCallback } from "react";

// --- Your WORD_BANK ---
const WORD_BANK = {
  PEN: [
    "WRITE",
    "INK",
    "PAPER",
    "NOTE",
    "DRAW",
    "SIGN",
    "DESK",
    "BOOK",
    "LETTER",
    "HAND",
  ],
  OCEAN: [
    "WATER",
    "FISH",
    "WAVE",
    "SALT",
    "DEEP",
    "SEA",
    "BLUE",
    "SHIP",
    "CORAL",
    "BEACH",
  ],
  FIRE: [
    "HEAT",
    "FLAME",
    "SMOKE",
    "BURN",
    "ASH",
    "HOT",
    "WOOD",
    "SPARK",
    "LIGHT",
    "DANGER",
  ],
  SCHOOL: [
    "STUDENT",
    "TEACHER",
    "BOOK",
    "CLASS",
    "LEARN",
    "PEN",
    "EXAM",
    "DESK",
    "LESSON",
    "HOMEWORK",
  ],
  CAR: [
    "DRIVE",
    "WHEEL",
    "ENGINE",
    "ROAD",
    "FUEL",
    "SPEED",
    "DOOR",
    "SEAT",
    "BRAKE",
    "KEY",
  ],
  TREE: [
    "LEAF",
    "WOOD",
    "ROOT",
    "FOREST",
    "BRANCH",
    "GREEN",
    "NATURE",
    "SHADE",
    "BIRD",
    "FRUIT",
  ],
  SUN: [
    "LIGHT",
    "HEAT",
    "DAY",
    "SKY",
    "BRIGHT",
    "WARM",
    "ENERGY",
    "SHINE",
    "SUMMER",
    "RAY",
  ],
  MOON: [
    "NIGHT",
    "SKY",
    "LIGHT",
    "DARK",
    "STAR",
    "SPACE",
    "ROUND",
    "GLOW",
    "ORBIT",
    "SILVER",
  ],
  COMPUTER: [
    "SCREEN",
    "KEYBOARD",
    "MOUSE",
    "CODE",
    "PROGRAM",
    "INTERNET",
    "DATA",
    "SOFTWARE",
    "HARDWARE",
    "FILE",
  ],
  PHONE: [
    "CALL",
    "SCREEN",
    "APP",
    "MESSAGE",
    "TOUCH",
    "RING",
    "BATTERY",
    "CAMERA",
    "CHAT",
    "NUMBER",
  ],
  BOOK: [
    "READ",
    "PAGE",
    "STORY",
    "AUTHOR",
    "LIBRARY",
    "TEXT",
    "COVER",
    "NOVEL",
    "CHAPTER",
    "WORD",
  ],
  MUSIC: [
    "SONG",
    "SOUND",
    "BEAT",
    "RHYTHM",
    "SINGER",
    "GUITAR",
    "PIANO",
    "LISTEN",
    "MELODY",
    "VOICE",
  ],
  FOOD: [
    "EAT",
    "MEAL",
    "TASTE",
    "COOK",
    "KITCHEN",
    "HUNGER",
    "PLATE",
    "RECIPE",
    "INGREDIENT",
    "DINNER",
  ],
  WATER: [
    "DRINK",
    "LIQUID",
    "RIVER",
    "RAIN",
    "SEA",
    "CLEAR",
    "FLOW",
    "DROP",
    "GLASS",
    "COLD",
  ],
  CITY: [
    "BUILDING",
    "ROAD",
    "TRAFFIC",
    "PEOPLE",
    "SHOP",
    "LIGHT",
    "NOISE",
    "CAR",
    "STREET",
    "URBAN",
  ],
  DOG: [
    "BARK",
    "PET",
    "TAIL",
    "ANIMAL",
    "LOYAL",
    "FUR",
    "WALK",
    "BONE",
    "PLAY",
    "FRIEND",
  ],
  CAT: [
    "MEOW",
    "PET",
    "TAIL",
    "FUR",
    "SLEEP",
    "CLIMB",
    "HUNT",
    "SOFT",
    "ANIMAL",
    "WHISKER",
  ],
  BIRD: [
    "FLY",
    "WING",
    "FEATHER",
    "SKY",
    "SING",
    "NEST",
    "EGG",
    "TREE",
    "AIR",
    "BEAK",
  ],
  RAIN: [
    "WATER",
    "CLOUD",
    "DROP",
    "STORM",
    "WET",
    "UMBRELLA",
    "SKY",
    "THUNDER",
    "COLD",
    "WEATHER",
  ],
  SNOW: [
    "COLD",
    "WHITE",
    "WINTER",
    "ICE",
    "FLAKE",
    "FREEZE",
    "SOFT",
    "SKI",
    "MOUNTAIN",
    "FROST",
  ],
  BEACH: [
    "SAND",
    "SEA",
    "WAVE",
    "SUN",
    "SWIM",
    "SUMMER",
    "COAST",
    "SHELL",
    "RELAX",
    "WATER",
  ],
  MOUNTAIN: [
    "HIGH",
    "ROCK",
    "CLIMB",
    "SNOW",
    "PEAK",
    "NATURE",
    "HIKE",
    "COLD",
    "VIEW",
    "VALLEY",
  ],
  RIVER: [
    "WATER",
    "FLOW",
    "STREAM",
    "FISH",
    "BRIDGE",
    "BANK",
    "NATURE",
    "CURRENT",
    "BLUE",
    "BOAT",
  ],
  AIRPLANE: [
    "FLY",
    "SKY",
    "WING",
    "PILOT",
    "TRAVEL",
    "AIRPORT",
    "ENGINE",
    "SEAT",
    "FAST",
    "CLOUD",
  ],
  TRAIN: [
    "TRACK",
    "STATION",
    "TRAVEL",
    "RAIL",
    "SPEED",
    "PASSENGER",
    "ENGINE",
    "TICKET",
    "LINE",
    "CARRIAGE",
  ],
  HOUSE: [
    "HOME",
    "ROOM",
    "DOOR",
    "WINDOW",
    "FAMILY",
    "ROOF",
    "BED",
    "KITCHEN",
    "CHAIR",
    "TABLE",
  ],
  BED: [
    "SLEEP",
    "REST",
    "PILLOW",
    "DREAM",
    "BLANKET",
    "NIGHT",
    "ROOM",
    "SOFT",
    "RELAX",
    "TIRED",
  ],
  CLOCK: [
    "TIME",
    "HOUR",
    "MINUTE",
    "SECOND",
    "WATCH",
    "TICK",
    "ALARM",
    "WALL",
    "ROUND",
    "NUMBER",
  ],
  GAME: [
    "PLAY",
    "FUN",
    "WIN",
    "LOSE",
    "LEVEL",
    "SCORE",
    "PLAYER",
    "CHALLENGE",
    "RULE",
    "TEAM",
  ],
  BALL: [
    "ROUND",
    "PLAY",
    "SPORT",
    "THROW",
    "CATCH",
    "KICK",
    "BOUNCE",
    "GAME",
    "FIELD",
    "TEAM",
  ],
  SPORT: [
    "PLAY",
    "TEAM",
    "WIN",
    "LOSE",
    "GAME",
    "TRAIN",
    "RUN",
    "BALL",
    "FIT",
    "COMPETE",
  ],
  DOCTOR: [
    "HOSPITAL",
    "PATIENT",
    "MEDICINE",
    "HEALTH",
    "CARE",
    "TREAT",
    "SICK",
    "HELP",
    "NURSE",
    "CLINIC",
  ],
  HOSPITAL: [
    "DOCTOR",
    "PATIENT",
    "ROOM",
    "CARE",
    "MEDICINE",
    "NURSE",
    "EMERGENCY",
    "HEALTH",
    "BED",
    "TREAT",
  ],
  TEACHER: [
    "SCHOOL",
    "STUDENT",
    "LESSON",
    "CLASS",
    "TEACH",
    "BOARD",
    "EXPLAIN",
    "BOOK",
    "LEARN",
    "HOMEWORK",
  ],
  STUDENT: [
    "LEARN",
    "SCHOOL",
    "BOOK",
    "CLASS",
    "STUDY",
    "EXAM",
    "NOTE",
    "DESK",
    "TEACHER",
    "WRITE",
  ],
  MARKET: [
    "SHOP",
    "BUY",
    "SELL",
    "FOOD",
    "PRICE",
    "STORE",
    "CUSTOMER",
    "CASH",
    "PRODUCT",
    "BAG",
  ],
  MONEY: [
    "CASH",
    "BUY",
    "PAY",
    "BANK",
    "COIN",
    "VALUE",
    "PRICE",
    "SAVE",
    "SPEND",
    "RICH",
  ],
  BANK: [
    "MONEY",
    "ACCOUNT",
    "SAVE",
    "LOAN",
    "CASH",
    "CARD",
    "FINANCE",
    "PAY",
    "SAFE",
    "TRANSFER",
  ],
  SHOP: [
    "BUY",
    "SELL",
    "STORE",
    "PRODUCT",
    "PRICE",
    "CUSTOMER",
    "BAG",
    "CASH",
    "ITEM",
    "MARKET",
  ],
  FARM: [
    "ANIMAL",
    "CROP",
    "FIELD",
    "TRACTOR",
    "FOOD",
    "GROW",
    "PLANT",
    "RURAL",
    "HARVEST",
    "BARN",
  ],
  HORSE: [
    "RUN",
    "ANIMAL",
    "RIDE",
    "FAST",
    "FARM",
    "STRONG",
    "TAIL",
    "GRASS",
    "SADDLE",
    "FIELD",
  ],
  COW: [
    "MILK",
    "FARM",
    "ANIMAL",
    "GRASS",
    "FIELD",
    "FOOD",
    "MEAT",
    "HERD",
    "RURAL",
    "GRAZE",
  ],
  SHEEP: [
    "WOOL",
    "FARM",
    "ANIMAL",
    "GRASS",
    "HERD",
    "SOFT",
    "FIELD",
    "RURAL",
    "LAMB",
    "GRAZE",
  ],
  FISH: [
    "WATER",
    "SWIM",
    "SEA",
    "OCEAN",
    "RIVER",
    "SCALE",
    "FIN",
    "CATCH",
    "NET",
    "FOOD",
  ],
  EGG: [
    "FOOD",
    "BREAKFAST",
    "CHICKEN",
    "SHELL",
    "COOK",
    "WHITE",
    "YOLK",
    "FRY",
    "BOIL",
    "PROTEIN",
  ],
  CHAIR: [
    "SIT",
    "TABLE",
    "WOOD",
    "FURNITURE",
    "ROOM",
    "LEG",
    "BACK",
    "COMFORT",
    "HOME",
    "DESK",
  ],
  TABLE: [
    "CHAIR",
    "EAT",
    "WOOD",
    "ROOM",
    "SURFACE",
    "DESK",
    "HOME",
    "MEAL",
    "FURNITURE",
    "FLAT",
  ],
  WINDOW: [
    "GLASS",
    "LIGHT",
    "VIEW",
    "OPEN",
    "CLOSE",
    "HOUSE",
    "AIR",
    "FRAME",
    "CLEAR",
    "ROOM",
  ],
  DOOR: [
    "OPEN",
    "CLOSE",
    "ENTER",
    "EXIT",
    "HANDLE",
    "ROOM",
    "HOUSE",
    "LOCK",
    "KEY",
    "WOOD",
  ],
};

const WordCatcherPro = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const basketX = useRef(325); // Initial center position
  const fallingWords = useRef([]);

  const [gameState, setGameState] = useState("START");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [target, setTarget] = useState("");

  const config = { width: 800, height: 500, basketWidth: 150 };

  // --- Sound Effects Logic ---
  const playSfx = (type) => {
    try {
      const audio = new Audio(`/sounds/${type}.mp3`);
      audio.volume = 0.4;
      audio.play();
    } catch (e) {
      console.log("Audio play blocked");
    }
  };

  // --- Fast Mouse Control ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        // Instant update without state re-render for maximum speed
        basketX.current = Math.max(
          0,
          Math.min(
            mouseX - config.basketWidth / 2,
            config.width - config.basketWidth
          )
        );
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const generateLevel = useCallback((category) => {
    const correct = WORD_BANK[category] || [];
    const others = Object.keys(WORD_BANK)
      .filter((k) => k !== category)
      .flatMap((k) => WORD_BANK[k]);

    const pool = [
      ...correct
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
        .map((t) => ({ text: t, isCorrect: true })),
      ...[...new Set(others)]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
        .map((t) => ({ text: t, isCorrect: false })),
    ];

    fallingWords.current = pool
      .sort(() => 0.5 - Math.random())
      .map((w) => ({
        ...w,
        x: Math.random() * (config.width - 110),
        y: -Math.random() * 800,
        speed: 2 + Math.random() * 2.5, // Increased speed for more challenge
      }));
  }, []);

  const update = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, config.width, config.height);

    // Draw Basket
    ctx.fillStyle = "#00f2ff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2ff";
    ctx.beginPath();
    ctx.roundRect(
      basketX.current,
      config.height - 40,
      config.basketWidth,
      12,
      10
    );
    ctx.fill();

    // Draw Words
    fallingWords.current.forEach((word) => {
      word.y += word.speed;

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(word.x, word.y, 110, 35);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(word.text, word.x + 55, word.y + 22);

      // Fast Collision Detection
      if (
        word.y > config.height - 50 &&
        word.y < config.height - 20 &&
        word.x + 110 > basketX.current &&
        word.x < basketX.current + config.basketWidth
      ) {
        if (word.isCorrect) {
          setScore((s) => s + 10);
          playSfx("collect"); // Success sound
        } else {
          setScore((s) => Math.max(0, s - 10));
          playSfx("bump"); // Error sound
        }
        word.y = -100 - Math.random() * 500;
        word.x = Math.random() * (config.width - 110);
      }

      if (word.y > config.height) {
        word.y = -100 - Math.random() * 500;
        word.x = Math.random() * (config.width - 110);
      }
    });

    if (gameState === "PLAYING")
      requestRef.current = requestAnimationFrame(update);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "PLAYING")
      requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, update]);

  // Timer & Start Logic
  const start = () => {
    const keys = Object.keys(WORD_BANK);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setTarget(randomKey);
    generateLevel(randomKey);
    setScore(0);
    setTimeLeft(40);
    setGameState("PLAYING");
  };

  useEffect(() => {
    if (gameState === "PLAYING" && timeLeft > 0) {
      const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    } else if (timeLeft === 0) setGameState("GAMEOVER");
  }, [gameState, timeLeft]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ONECLICK GAMES</h1>
      <div style={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          width={config.width}
          height={config.height}
          style={styles.canvas}
        />

        {gameState !== "PLAYING" && (
          <div style={styles.overlay}>
            <h2>{gameState === "START" ? "WORD CATCHER" : "TIME UP!"}</h2>
            {gameState === "GAMEOVER" && <p>Final Score: {score}</p>}
            <button onClick={start} style={styles.btn}>
              START GAME
            </button>
          </div>
        )}

        {gameState === "PLAYING" && (
          <div style={styles.hud}>
            <span>
              TARGET: <b>{target}</b>
            </span>
            <span>SCORE: {score}</span>
            <span>TIME: {timeLeft}s</span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },
  title: { letterSpacing: "10px", color: "#00f2ff" },
  canvasWrapper: {
    position: "relative",
    border: "2px solid #333",
    borderRadius: "10px",
    overflow: "hidden",
  },
  canvas: { background: "#050505" },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    padding: "15px 40px",
    fontSize: "1.2rem",
    background: "#00f2ff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  hud: {
    position: "absolute",
    top: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    padding: "15px",
    fontWeight: "bold",
    pointerEvents: "none",
  },
};

export default WordCatcherPro;
