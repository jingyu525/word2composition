/**
 * Zustand persist storage 适配器
 * 桥接 localStorage 与 zustand/middleware 的 StateStorage 接口
 *
 * 关键设计：
 * 1. getItem 返回**原始 JSON 字符串**（zustand createJSONStorage 内部会再 parse）
 *    不要用 readStorage（已 parse），否则 zustand 拿到的是对象而非字符串
 * 2. zustand 传入的 key 是完整 key（如 "w2c.meta"），不要再加前缀
 */

import type { StateStorage } from 'zustand/middleware';

export const w2cStateStorage: StateStorage = {
  getItem: (key: string): string | null => localStorage.getItem(key),
  setItem: (key: string, value: string): void => {
    localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
};
