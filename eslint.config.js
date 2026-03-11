// eslint.config.js - для Next.js
const nextConfig = require("./next.config.js");

const eslintConfig = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/purity": "off",
    "react-hooks/set-state-in-effect": "off",
  },
};

module.exports = eslintConfig;
