import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config, context) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      // Webpack doesn't dedupe correctly, so alias to client node_modules
      // Solve by making this a propper monorepo with shared deps
      'react-native': path.resolve('../client/node_modules/react-native-web'),
      'styled-components': path.resolve(
        '../client/node_modules/styled-components',
      ),
      'react-native-safe-area-context': path.resolve(
        '../client/node_modules/react-native-safe-area-context',
      ),
      'react-i18next': path.resolve('../client/node_modules/react-i18next'),
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    config.plugins.push(
      new context.webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV === 'development',
      }),
    );
    return config;
  },
};

export default nextConfig;
