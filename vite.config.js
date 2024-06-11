import path from 'path';

import svgr from '@svgr/rollup';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';

dotenv.config();

export default defineConfig({
  root: path.resolve(__dirname, 'src', 'app'),
  build: {
    outDir: path.resolve(__dirname, 'src', 'app', 'dist'),
    emptyOutDir: true,
    sourcemap: true,
  },
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    EnvironmentPlugin('all', { prefix: 'CANISTER_' }),
    EnvironmentPlugin('all', { prefix: 'DFX_' }),
    EnvironmentPlugin({ LEDGER_HOST: 'ic0.app', BACKEND_CANISTER_ID: '' }),
    svgr(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
});
