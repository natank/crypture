// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

export default tseslint.config({ ignores: ["dist"] }, {
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
}, storybook.configs["flat/recommended"]);
