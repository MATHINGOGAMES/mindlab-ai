// src/ai/memoryEngine.js

export const generateMemoryPairs = (level, stage = "PRIMARY") => {
  const pairs = [];
  const usedQuestions = new Set();
  const count = Math.min(4 + Math.floor(level / 2), 10);

  while (pairs.length < count * 2) {
    let q, a;

    if (stage === "PRIMARY") {
      const n1 = Math.floor(Math.random() * (level * 5)) + 2;
      const n2 = Math.floor(Math.random() * 10) + 1;
      const isAdd = Math.random() > 0.5;
      q = isAdd ? `${n1} + ${n2}` : `${Math.max(n1, n2)} - ${Math.min(n1, n2)}`;
      a = isAdd
        ? (n1 + n2).toString()
        : (Math.max(n1, n2) - Math.min(n1, n2)).toString();
    } else if (stage === "MIDDLE") {
      const n = Math.floor(Math.random() * 12) + 2;
      const isSquare = Math.random() > 0.5;
      q = isSquare ? `${n}²` : `√${n * n}`;
      a = isSquare ? (n * n).toString() : n.toString();
    } else {
      const trig = [
        { q: "sin(30°)", a: "0.5" },
        { q: "sin(90°)", a: "1" },
        { q: "cos(0°)", a: "1" },
        { q: "cos(60°)", a: "0.5" },
        { q: "log10(100)", a: "2" },
        { q: "log2(8)", a: "3" },
      ];
      const selected = trig[Math.floor(Math.random() * trig.length)];
      q = selected.q;
      a = selected.a;
    }

    if (!usedQuestions.has(q)) {
      usedQuestions.add(q);
      const matchId = Date.now() + pairs.length;
      pairs.push({ id: `q-${matchId}`, content: q, matchId, side: "question" });
      pairs.push({ id: `a-${matchId}`, content: a, matchId, side: "answer" });
    }
  }

  return pairs.sort(() => Math.random() - 0.5);
};
