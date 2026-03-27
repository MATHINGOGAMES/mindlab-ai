import { Link } from "react-router-dom";

export default function Home() {
  // 🎮 قائمة الألعاب (قابلة للتوسعة)
  const games = [
    { name: "Sudoku", path: "/game/sudoku", emoji: "🧩" },
    // مستقبلاً:
    { name: "NeuralGrid", path: "/game/neuralGrid", emoji: "🧠" },
    // { name: "Puzzle", path: "/game/puzzle", emoji: "🧩" },
  ];

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>🎮 Welcome to MindLab</h1>
      <p style={{ fontSize: 18, marginTop: 10 }}>
        Choose a game and train your brain!
      </p>

      <div
        style={{
          marginTop: 30,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 15,
          justifyItems: "center",
        }}
      >
        {games.map((game) => (
          <Link
            key={game.name}
            to={game.path}
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                padding: "15px 25px",
                fontSize: 16,
                cursor: "pointer",
                borderRadius: 10,
                border: "2px solid #333",
                backgroundColor: "#fff",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              {game.emoji} {game.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
