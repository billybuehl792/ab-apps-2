import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import theme from "./src/store/config/theme";

// https://vite.dev/config/
export default defineConfig({
  base: "/app/",
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: process.env.NODE_ENV === "production" },
      workbox: { navigateFallbackDenylist: [/^\/api\//] },
      manifest: {
        name: "AB Apps",
        short_name: "AB Apps",
        description: "Utility Apps and Tools",
        display: "standalone",
        start_url: "/app/",
        background_color: theme.palette.primary.contrastText,
        theme_color: theme.palette.primary.main,
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    sourcemap: true, // Source map generation must be turned on for Sentry
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules") && !id.includes("sentry")) {
            return id.split("node_modules/")[1].split("/")[0];
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
