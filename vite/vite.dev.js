import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import image from '@rollup/plugin-image';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';

export default defineConfig({
  root: '../',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: path.join(__dirname, 'src/index-dev.html'),
    },
  },
  resolve: {
    alias: [
      {
        find: '@src',
        replacement: path.resolve(__dirname, '../src'),
      },
      {
        find: '@resources',
        replacement: path.resolve(__dirname, '../src/resources'),
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, '../src/components'),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        relativeUrls: true,
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    react(),
    image(),
    createHtmlPlugin({
      inject: false,
      pages: [
        {
          filename: 'silent-check-sso.html',
          template: path.resolve(
            path.resolve(__dirname, '../src'),
            'silent-check-sso.html',
          ),
        },
      ],
    }),
    createHtmlPlugin({
      pages: [
        {
          entry: 'index.tsx',
          filename: 'index.html',
          template: path.resolve(
            path.resolve(__dirname, '../src'),
            'index-dev.html',
          ),
        },
      ],
    }),
  ],
  server: {
    port: 9000,
  },
});
