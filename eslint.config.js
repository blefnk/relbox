// @ts-check

import eslintJs from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginReadableTailwind from "eslint-plugin-readable-tailwind";

export default tseslint.config([
  globalIgnores(["dist", ".next"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      perfectionist.configs["recommended-natural"],
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "readable-tailwind": eslintPluginReadableTailwind,
    },
    rules: {
      ...eslintPluginReadableTailwind.configs.warning.rules,
      "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off",
      "@eslint-react/no-array-index-key": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "no-useless-escape": "off",
    },
    settings: {
      "readable-tailwind": {
        entryPoint: "shared/styles/globals.css",
      },
    },
  },
]);
