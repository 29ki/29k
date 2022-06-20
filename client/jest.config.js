const modules = ['react-native', '@react-native'];

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
  transformIgnorePatterns: [
    // Solves the issue of non transpiled modules. See https://github.com/getsentry/sentry-react-native/issues/668
    `./node_modules/(?!(${modules.join('|')}).*/)`,
  ],
};
