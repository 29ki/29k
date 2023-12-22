import dns from 'dns';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

/*
  GitHub authentication only works on "localhost" and not "127.0.0.1".
  https://vitejs.dev/guide/migration.html#dev-server-changes
*/
dns.setDefaultResultOrder('verbatim');

// react-native-web specific
const extensions = [
  '.web.tsx',
  '.tsx',
  '.web.ts',
  '.ts',
  '.web.jsx',
  '.jsx',
  '.web.js',
  '.js',
  '.css',
  '.json',
];

export default defineConfig({
  root: 'src',
  server: {
    port: 1234,
    open: '/',
  },
  build: {
    outDir: '../dist',
  },
  plugins: [
    react({
      include: /\.(jsx|tsx)$/,
      babel: {
        plugins: ['styled-components'],
        babelrc: false,
        configFile: false,
      },
    }),
  ],

  // react-native-web specific
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
    },
  },
  resolve: {
    extensions,
    alias: {
      'react-native': 'react-native-web',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
    },
  },
  define: {
    global: 'window',
    __DEV__: process.env.NODE_ENV === 'development',
  },
});
