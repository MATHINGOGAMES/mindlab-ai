import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // 👈 استيراد مكتبة المسارات

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // ✅ غير هذا السطر ليصبح هكذا:
    base: "./",
  };
});
