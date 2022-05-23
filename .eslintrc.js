module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  extends: [
    'plugin:prettier/recommended',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
    amd: true,
  },
  rules: {
    'no-debugger': 0,
    'no-console': 0,
    'class-methods-use-this': 0,
    '@typescript-eslint/no-explicit-any': 1,
    'no-var': 2,
  },
};
