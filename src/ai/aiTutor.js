import { askAI } from "./aiClient";

export async function explainAnswer(question, userAnswer, correctAnswer) {
  const prompt = `
  Question: ${question}
  User Answer: ${userAnswer}
  Correct Answer: ${correctAnswer}

  Explain the mistake in a simple and friendly way.
  `;

  return await askAI(prompt);
}