// src/ai/aiService.js

/** * 1. الاتصال بـ OpenAI
 */
export async function askAI(prompt) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a puzzle generator AI. Always return valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("AI Error:", err);
    return "Keep going! You're doing great.";
  }
}

/**
 * 2. شرح الأخطاء (المعلم الذكي)
 */
export async function explainAnswer(question, userAnswer, correctAnswer) {
  const prompt = `
  Question: ${question}
  User Answer: ${userAnswer}
  Correct Answer: ${correctAnswer}
  Explain the mistake in a very simple and friendly way for a child.
  `;
  return await askAI(prompt);
}

/**
 * 3. تحليل أداء اللاعب وتحديد نقاط الضعف
 */
export function analyzePlayerModel(history) {
  const stats = {
    ARITHMETIC: { correct: 0, wrong: 0 },
    GEOMETRIC: { correct: 0, wrong: 0 },
    MIXED: { correct: 0, wrong: 0 },
  };

  history.forEach((h) => {
    if (!h.pattern) return;
    const p = h.pattern.toUpperCase(); // لضمان التطابق مع المولد
    if (stats[p]) {
      if (h.correct) stats[p].correct++;
      else stats[p].wrong++;
    }
  });

  const weaknesses = Object.entries(stats)
    .map(([type, val]) => ({
      type,
      score: val.correct - val.wrong,
    }))
    .sort((a, b) => a.score - b.score);

  return {
    weakest: weaknesses[0]?.type || "ARITHMETIC",
    stats,
  };
}

/**
 * 4. تعديل الصعوبة
 */
export function adjustDifficulty(accuracy, currentLevel) {
  if (accuracy > 0.8) return currentLevel + 1;
  if (accuracy < 0.5 && currentLevel > 1) return currentLevel - 1;
  return currentLevel;
}