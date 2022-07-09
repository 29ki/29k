import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    port: '1234',
  },
  build: {
    outDir: '../dist',
  },
});
