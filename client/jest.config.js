// This needs to be mocked before runners since react-native-config is a
// babel plugin
process.env = Object.assign(process.env, {
  CLIENT_CODE_PUSH_DEPLOYMENT_KEY: '',
  CLIENT_ENVIRONMENT: 'dev',
});
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
