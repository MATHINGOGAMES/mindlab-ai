import { askAI } from "./aiClient";

export async function getHint(question) {
  const prompt = `
  Give a small hint without revealing the answer:
  ${question}
  `;

  return await askAI(prompt);
}