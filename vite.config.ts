import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  base: '/word2composition/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@app': path.resolve(import.meta.dirname, './src/app'),
      '@pages': path.resolve(import.meta.dirname, './src/pages'),
      '@widgets': path.resolve(import.meta.dirname, './src/widgets'),
      '@features': path.resolve(import.meta.dirname, './src/features'),
      '@entities': path.resolve(import.meta.dirname, './src/entities'),
      '@shared': path.resolve(import.meta.dirname, './src/shared'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
