// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"], // ✅ points to the file above,
    include: ["**/*.{test,test.*}.?(c|m)[jt]s?(x)"], // ✅ Match only .test.js/ts/tsx
  },
  resolve: {
    alias: {
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@services": path.resolve(__dirname, "src/services"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@e2e": path.resolve(__dirname, "src/e2e"),
      "@test-setup": path.resolve(__dirname, "src/e2e/test-setup.ts"),
    },
  },
});
