// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"], // ✅ points to the file above,
    include: ["**/*.{test,test.*}.?(c|m)[jt]s?(x)"], // ✅ Match only .test.js/ts/tsx
  },
});
