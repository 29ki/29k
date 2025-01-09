const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
/**
 * Metro configuration for React Native
 * https://reactnative.dev/docs/metro
 *
 * @format
 */

var path = require('path');

const {
  createSentryMetroSerializer,
} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

/*
   Shared folder outside project root
   https://medium.com/@dushyant_db/how-to-import-files-from-outside-of-root-directory-with-react-native-metro-bundler-18207a348427
 */

const extraNodeModules = {
  shared: path.resolve(__dirname, '../shared'),
  content: path.resolve(__dirname, '../content'),
};

const watchFolders = [
  path.resolve(__dirname, '../shared'),
  path.resolve(__dirname, '../content'),
];

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },

  resolver: {
    extraNodeModules: new Proxy(extraNodeModules, {
      get: (target, name) =>
        //redirects dependencies referenced from shared/ to local node_modules
        name in target
          ? target[name]
          : path.join(process.cwd(), `node_modules/${name}`),
    }),
  },

  watchFolders,

  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },
};

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
);
