// vite.config.js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // redirige tout /api/* vers localhost:8080
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      // si vous utilisez /commands sans /api devant
      "/commands": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
      "/warehouse-stock": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});