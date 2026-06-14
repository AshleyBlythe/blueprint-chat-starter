import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The frontend (Vite) runs on port 5173 by default.
// API requests to `/api/*` are proxied to the local Express backend so the
// browser never talks to AI providers directly.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
