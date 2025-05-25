// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  overrides: [
    {
      files: ["src/e2e/specs/**/*.ts"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "@playwright/test",
                message:
                  "Use '@test-setup' to import 'test' and 'expect' in E2E tests.",
              },
              {
                name: "../test-fixtures",
                message: "Use '@test-setup' instead.",
              },
            ],
          },
        ],
      },
    },
  ],
};
