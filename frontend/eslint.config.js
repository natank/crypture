// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

export default tseslint.config({ ignores: ["dist", "coverage"] }, {
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
    "no-relative-import-paths": noRelativeImportPaths,
    import: importPlugin,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,

    // ✅ Allow aliases like @services
    "import/no-unresolved": "error",
    "no-relative-import-paths/no-relative-import-paths": [
      "error",
      {
        allowSameFolder: true,
        rootDir: "src",
        prefix: "@",
      },
    ],
    // ❌ Disallow imports like ../services/coinGecko
    // "import/no-relative-parent-imports": [
    //   "error",
    //   {
    //     ignore: [
    //       "@components/",
    //       "@hooks/",
    //       "@pages/",
    //       "@utils/",
    //       "@e2e/",
    //       "@services/",
    //       "@wypes/",
    //     ],
    //   },
    // ],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json", // use aliases from here
      },
    },
  },
  // Overrides for tests and stories
},
{
  files: [
    "**/__tests__/**/*.{ts,tsx}",
    "**/*.test.{ts,tsx}",
    "src/e2e/**/*.{ts,tsx}",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    // Allow relative imports in tests/e2e for convenience
    "no-relative-import-paths/no-relative-import-paths": "off",
    "@typescript-eslint/ban-ts-comment": ["warn", { "ts-ignore": true }],
  },
},
{
  files: ["**/__stories__/**/*.{ts,tsx}", "**/*.stories.{ts,tsx}"],
  rules: {
    "storybook/no-renderer-packages": "off",
    // Keep other storybook recommended rules via plugin include below
  },
},
storybook.configs["flat/recommended"],
// Final overrides to ensure precedence
{
  files: [
    "**/__tests__/**/*.{ts,tsx}",
    "**/*.test.{ts,tsx}",
    "src/e2e/**/*.{ts,tsx}",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
  },
},
{
  files: ["**/__stories__/**/*.{ts,tsx}", "**/*.stories.{ts,tsx}"],
  rules: {
    "storybook/no-renderer-packages": "off",
    "no-relative-import-paths/no-relative-import-paths": "off",
  },
});
