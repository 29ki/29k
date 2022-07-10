module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [
    '/dist/**/*', // Ignore built files.
  ],
  plugins: ['import'],
  rules: {
    'import/no-unresolved': 0,
  },
};
