import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // 👈 استيراد مكتبة المسارات

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        // 🚀 الآن يمكنك استخدام @ للإشارة لمجلد src من أي مكان
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base:
      process.env.NODE_ENV === "production" && !process.env.VERCEL
        ? "/mindlab-ai/"
        : "/",
  };
});
