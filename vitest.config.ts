import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Vitest 2.1 内部依赖 Vite 5 类型，与项目 Vite 8 不兼容
 * 因此独立 vitest.config.ts，避免 vite.config.ts 类型冲突
 */
export default defineConfig({
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
  test: {
    environment: 'node', // lib/ 是纯函数，inline mock 即可
    globals: false, // 显式 import，避免污染
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/shared/lib/**/*.ts'],
      thresholds: {
        // CLAUDE.md §12 C1 要求 lib/ 覆盖率 ≥ 80%
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
