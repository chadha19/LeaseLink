import { defineConfig } from "vite";
import path from "path";

// Simplified Vite config without external React plugin
// Using Vite's built-in JSX support instead
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    hmr: {
      overlay: true,
    },
  },
});