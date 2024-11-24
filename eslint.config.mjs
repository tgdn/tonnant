import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: [
      "eslint.config.mjs",
      "jest.config.ts",
      "dist/**",
      "**/ios/**",
      "**/android/**",
      "node_modules/**",
    ],
  },
  // TypeScript rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"], // We use TS config only for TS files
  })),
  // ...tseslint.configs.recommendedTypeChecked,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-duplicate-type-constituents": "off",
    },
  },
  {
    files: ["apps/mobile/**/*.{js,ts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/__tests__/**/*.{js,ts,jsx,tsx}"],
    rules: { "@typescript-eslint/no-unsafe-assignment": "off" },
  },
];
