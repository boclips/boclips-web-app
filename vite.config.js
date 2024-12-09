/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import image from '@rollup/plugin-image';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  define: {
    global: {},
  },
  root: path.resolve(__dirname, 'src'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: [
      {
        find: '@src',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@resources',
        replacement: path.resolve(__dirname, 'src/resources'),
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
    ],
  },
  // css: {
  //   preprocessorOptions: {
  //     less: {
  //       math: 'always',
  //       relativeUrls: true,
  //       javascriptEnabled: true,
  //     },
  //   },
  // },
  plugins: [
    react({
      include: /\.(js|jsx|ts|tsx|less)$/,
      jsxRuntime: 'classic',
    }),
    image(),
    svgr(),
  ],
  server: {
    port: 9000,
    https: false,
  },
  test: {
    include: ['**/*.test.tsx'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.ts',
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    server: {
      sourcemap: false,
    },
  },
});
