module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'config',
        allowUndefined: false,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
