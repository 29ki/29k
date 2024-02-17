module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:i18next/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.library.tsx'],
      rules: {
        'i18next/no-literal-string': 'off',
      },
    },
  ],
};
