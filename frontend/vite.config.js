import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const proxy = {
  "/api": {
    target: process.env.VITE_PROXY_TARGET || "http://127.0.0.1:8000",
    changeOrigin: true,
  },
  "/media": {
    target: process.env.VITE_PROXY_TARGET || "http://127.0.0.1:8000",
    changeOrigin: true,
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
});
