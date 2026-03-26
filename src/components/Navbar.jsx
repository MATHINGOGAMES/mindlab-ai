import { useGameStore } from "../core/store";

export default function Navbar() {
  const { xp, level } = useGameStore();
  const xpPercentage = Math.min((xp / 100) * 100, 100);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#1a1a1a",
        color: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 22 }}>MINDLAB AI</h2>

      <div style={{ textAlign: "right" }}>
        <div style={{ marginBottom: 4 }}>
          Level: <strong>{level}</strong>
        </div>
        <div
          style={{
            background: "#333",
            borderRadius: 8,
            width: 120,
            height: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${xpPercentage}%`,
              height: "100%",
              background: "linear-gradient(90deg, #00f, #0ff)",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>
        <div style={{ fontSize: 12, marginTop: 2 }}>XP: {xp}/100</div>
      </div>
    </div>
  );
}
