/**
 * Zustand persist storage 适配器
 * 桥接 src/shared/lib/storage.ts 与 zustand/middleware 的 StateStorage 接口
 */

import { readStorage, removeStorage, writeStorage } from '@shared/lib/storage';
import type { StateStorage } from 'zustand/middleware';

export const w2cStateStorage: StateStorage = {
  getItem: (key: string): string | null => readStorage<string>(key),
  setItem: (key: string, value: string): void => {
    writeStorage(key, value);
  },
  removeItem: (key: string): void => {
    removeStorage(key);
  },
};
