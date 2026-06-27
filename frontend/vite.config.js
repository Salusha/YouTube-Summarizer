import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite Configuration
 * - Uses React plugin for JSX support
 * - Proxies /api requests to the backend during development
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
