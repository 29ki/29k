import dns from 'dns';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

/*
  GitHub authentication only works on "localhost" and not "127.0.0.1".
  https://vitejs.dev/guide/migration.html#dev-server-changes
*/
dns.setDefaultResultOrder('verbatim');

/*
  react-native-web specific config originates from these sources:
  https://github.com/necolas/react-native-web/issues/2446
  https://dev.to/xiongemi/using-react-native-web-with-vite-4in8
  https://stereobooster.com/posts/react-native-web-with-vite/
*/

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
  '.mjs',
];

export default defineConfig({
  root: 'src',
  server: {
    port: 1234,
    open: '/',
  },
  build: {
    outDir: '../dist',
    // react-native-web specific
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [react()],

  // react-native-web specific
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      // https://github.com/vitejs/vite-plugin-react/issues/192#issuecomment-1627384670
      jsx: 'automatic',
      // need either this or the plugin below
      loader: {'.js': 'jsx'},
      // plugins: [
      //   esbuildFlowPlugin(/\.(flow|jsx?)$/, (path) =>
      //     /\.jsx$/.test(path) ? "jsx" : "jsx"
      //   ),
      // ],
    },
  },
  resolve: {
    extensions,
    // Keep in sync with shared deps between client and cms
    dedupe: [
      'dayjs',
      'i18next',
      'react-native-safe-area-context',
      'react-native-web',
      'react-native',
      'react',
      'styled-components',
    ],
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
