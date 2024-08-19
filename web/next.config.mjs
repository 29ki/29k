import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  compiler: {
    styledComponents: true,
  },
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      // Webpack doesn't dedupe correctly, so alias to client node_modules
      // Solve by making this a propper monorepo with shared deps
      'react-native': path.resolve('../client/node_modules/react-native-web'),
      'styled-components': path.resolve(
        '../client/node_modules/styled-components',
      ),
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
};

export default nextConfig;
