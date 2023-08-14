module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:i18next/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
    {
      files: ['*.library.tsx'],
      rules: {
        'i18next/no-literal-string': 'off',
      },
    },
  ],
};
