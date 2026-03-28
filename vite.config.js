import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    // 🚀 إذا كنا نرفع لـ GitHub Pages (غالباً في مرحلة الإنتاج لاسم مستودع معين)
    // وإلا نترك المسار فارغاً ليعمل على Vercel بشكل طبيعي
    base:
      process.env.NODE_ENV === "production" && !process.env.VERCEL
        ? "/mindlab-ai/"
        : "/",
  };
});
