module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
  ],
  ignorePatterns: [".eslintrc.js"],
  "rules": {
    "semi": ["error", "never"],
    "prettier/prettier": ["error", { semi: false, printWidth: 120, singleQuote: true }],
  },
};
