// src/ai/aiGridGenerator.js

export async function generateAIGrid(
  level = 1,
  size = 3,
  mode = "GRID",
  stage = "PRIMARY"
) {
  const PATTERNS = ["ARITHMETIC", "GEOMETRIC", "LOGICAL"];
  const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

  try {
    // --- وضع لعبة الذاكرة (Memory / Pairs) ---
    if (mode === "PAIRS") {
      const cards = [];
      const usedQuestions = new Set();
      const pairCount = size; // عدد الأزواج المطلوب

      while (usedQuestions.size < pairCount) {
        let question, answer;

        if (stage === "PRIMARY") {
          const n1 = Math.floor(Math.random() * (level * 5)) + 2;
          const n2 = Math.floor(Math.random() * 10) + 1;
          const isAdd = Math.random() > 0.4;
          question = isAdd
            ? `${n1} + ${n2}`
            : `${Math.max(n1, n2)} - ${Math.min(n1, n2)}`;
          answer = isAdd
            ? (n1 + n2).toString()
            : (Math.max(n1, n2) - Math.min(n1, n2)).toString();
        } else if (stage === "MIDDLE") {
          const n = Math.floor(Math.random() * 10) + 2;
          const isSquare = Math.random() > 0.5;
          question = isSquare ? `${n}²` : `√${n * n}`;
          answer = isSquare ? (n * n).toString() : n.toString();
        } else {
          const trig = [
            { q: "sin(30°)", a: "0.5" },
            { q: "cos(60°)", a: "0.5" },
            { q: "tan(45°)", a: "1" },
            { q: "log10(100)", a: "2" },
          ];
          const pick = trig[Math.floor(Math.random() * trig.length)];
          question = pick.q;
          answer = pick.a;
        }

        if (!usedQuestions.has(question)) {
          usedQuestions.add(question);
          const matchId = Date.now() + usedQuestions.size;
          cards.push({
            id: `q-${matchId}`,
            content: question,
            matchId,
            type: "q",
          });
          cards.push({
            id: `a-${matchId}`,
            content: answer,
            matchId,
            type: "a",
          });
        }
      }
      return {
        cards: cards.sort(() => Math.random() - 0.5),
        pattern: "Memory Match",
      };
    }

    // --- وضع لعبة الشبكة (Neural Grid / Sequences) ---
    if (mode === "GRID") {
      const totalCells = size * size;
      let sequence = [];
      const diff =
        stage === "SECONDARY"
          ? level * 5
          : stage === "MIDDLE"
          ? level * 2
          : level;

      if (pattern === "GEOMETRIC" && stage !== "PRIMARY") {
        const r = 2;
        const s = Math.floor(Math.random() * 5) + 1;
        sequence = Array.from(
          { length: totalCells },
          (_, i) => s * Math.pow(r, i)
        );
      } else {
        const s = Math.floor(Math.random() * 20) + 1;
        const step = Math.floor(Math.random() * 5) + diff;
        sequence = Array.from({ length: totalCells }, (_, i) => s + i * step);
      }

      const hiddenIdx = Math.floor(Math.random() * totalCells);
      const answer = sequence[hiddenIdx];
      const displayGrid = [];
      for (let r = 0; r < size; r++) {
        displayGrid.push(
          sequence
            .slice(r * size, (r + 1) * size)
            .map((v, i) => (r * size + i === hiddenIdx ? "?" : v))
        );
      }
      return { displayGrid, answer, pattern };
    }
  } catch (e) {
    console.error("AI Grid Error:", e);
    return mode === "PAIRS" ? { cards: [] } : { displayGrid: [], answer: null };
  }
}
