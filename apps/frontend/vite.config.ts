import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  // Try to import tailwindcss, but don't fail if it's not available
  let tailwindcss;
  try {
    const tailwindModule = await import("@tailwindcss/vite");
    tailwindcss = tailwindModule.default;
  } catch {
    console.warn("TailwindCSS plugin not available, proceeding without it");
  }

  const plugins = [react()];
  if (tailwindcss) {
    plugins.push(tailwindcss());
  }

  return {
    plugins,
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
  };
});
