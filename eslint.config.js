/**
 * eslint.config.js
 * Purpose: ESLint configuration for the repository. It composes the
 * recommended JS rules, Prettier integration and adds specific rules
 * and parser setup for Astro files and accessibility plugins for JSX.
 */

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import astroParser from "astro-eslint-parser";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
    },
    plugins: { astro },
    rules: {
      "astro/no-unused-css-selector": "warn",
      "astro/no-set-html-directive": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: { "jsx-a11y": jsxA11y },
    rules: {
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/aria-role": "warn",
    },
  },
];

