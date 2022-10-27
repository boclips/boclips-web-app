import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

const path = require('path');

export default defineConfig({
  server: { port: 9000 },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      resources: path.resolve(__dirname, './src/resources'),
    },
  },
  build: {
    rollupOptions: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      },
    },
  },
  plugins: [
    // createHtmlPlugin({
    //   inject: false,
    //   filename: 'silent-check-sso.html',
    //   template: 'src/silent-check-sso.html',
    // }),

    react(),
    svgr({ exportAsDefault: true }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      open: true,
    }),
  ],
});
