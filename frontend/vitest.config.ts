// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["**/*.{test,test.*}.?(c|m)[jt]s?(x)"],
    coverage: {
      provider: "v8", // or 'c8'
      reporter: ["text", "html", "json-summary"],
      all: true,
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/__tests__/**",
        "**/*.test.*",
        "**/*.spec.*",
        "**/mocks/**",
        "**/stories/**",
        "**/.vite/**",
      ],
      thresholds: {
        lines: 60,
        functions: 80,
        statements: 60,
        branches: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@services": path.resolve(__dirname, "src/services"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@types": path.resolve(__dirname, "src/types"),
      "@e2e": path.resolve(__dirname, "src/e2e"),
      "@test-setup": path.resolve(__dirname, "src/e2e/test-setup.ts"),
    },
  },
});
