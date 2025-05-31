import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

const ignoreConfig = {
  ignores: ["**/*.{js,mjs,cjs}"],
};


export default defineConfig([
  ignoreConfig,
  {
    files: ["src/**/*.{ts,mts,cts}"],
    languageOptions: {
      globals: globals.browser, parserOptions: {
        "ecmaVersion": "latest",
        "sourceType": "module",
        parser: "@typescript-eslint/parser"
      },
    },
  },
  tseslint.configs.recommended,
]);
