/**
 * Progress entity store — src/entities/progress/model/store.ts
 * 断点续做（最多 1 份）
 * persist 到 localStorage key `progress`
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { w2cStateStorage } from '@shared/lib/storeStorage';
import type { Progress } from '@shared/types';

type ProgressState = {
  progress: Progress;
  setProgress: (p: Progress) => void;
  clearProgress: () => void;
};

const INITIAL: Progress = null as unknown as Progress;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: INITIAL,
      setProgress: (p: Progress) => set({ progress: p }),
      clearProgress: () => set({ progress: null as unknown as Progress }),
    }),
    {
      name: 'w2c.progress',
      storage: createJSONStorage(() => w2cStateStorage),
      partialize: (state) => ({ progress: state.progress }),
    },
  ),
);
