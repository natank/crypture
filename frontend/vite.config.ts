import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@services": path.resolve(__dirname, "src/services"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@e2e": path.resolve(__dirname, "src/e2e"),
      "@test-setup": path.resolve(__dirname, "src/e2e/test-setup.ts"),
      "@assets": path.resolve(__dirname, "public/assets"),
    },
  },
  build: {
    outDir: "dist", // compiled JS/CSS/assets will go here
    emptyOutDir: true,
  },
});
