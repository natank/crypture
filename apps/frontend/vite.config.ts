import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  resolve: {
    alias: {
      "@components": "/src/components",
      "@context": "/src/context",
      "@services": "/src/services",
      "@hooks": "/src/hooks",
      "@pages": "/src/pages",
      "@utils": "/src/utils",
      "@e2e": "/src/e2e",
      "@test-setup": "/src/e2e/test-setup.ts",
      "@types": "/src/types",
      "@assets": "/public/assets",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: true,
  },
});
