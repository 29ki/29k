/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

var path = require('path');

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

module.exports = {
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
};
