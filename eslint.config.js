// eslint.config.js - простой конфиг для ESLint 9
const js = require("@eslint/js");

module.exports = [
  {
    ignores: [".next", "out", "build", "node_modules"],
  },
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "off",
      "no-explicit-any": "off",
    },
  },
];
