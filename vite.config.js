import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/mindlab-ai/", // 🚀 أضف هذا السطر ليتوافق مع اسم المستودع الخاص بك
});
