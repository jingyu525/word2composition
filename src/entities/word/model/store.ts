/**
 * Word entity store — src/entities/word/model/store.ts
 * 种子词只读 + 初始化注入到 localStorage
 * persist 到 localStorage key `seeds`
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SEED_WORDS } from '@shared/consts/seeds';
import { w2cStateStorage } from '@shared/lib/storeStorage';
import type { SeedWord } from '@shared/types';

type WordState = {
  seeds: SeedWord[];
  replaceSeeds: (newSeeds: SeedWord[]) => void;
};

export const useWordStore = create<WordState>()(
  persist(
    (set) => ({
      seeds: [...SEED_WORDS],
      replaceSeeds: (newSeeds) => set({ seeds: newSeeds }),
    }),
    {
      name: 'w2c.seeds',
      storage: createJSONStorage(() => w2cStateStorage),
      partialize: (state) => ({ seeds: state.seeds }),
    },
  ),
);
