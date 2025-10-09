import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/v1/auth": {
        target: "http://127.0.0.1:8081",
        changeOrigin: true,
      },
      "/api/products": {
        target: "http://127.0.0.1:8081",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/categories": {
        target: "http://127.0.0.1:8081", 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
