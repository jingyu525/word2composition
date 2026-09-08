/**
 * Meta entity store — src/entities/meta/model/store.ts
 * 全局元数据（首次启动时间、引导是否完成、schemaVersion、导出次数）
 * persist 到 localStorage key `meta` + `schemaVersion`
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SCHEMA_VERSION, writeStorage } from '@shared/lib/storage';
import { w2cStateStorage } from '@shared/lib/storeStorage';
import type { Meta } from '@shared/types';

type MetaState = {
  meta: Meta;
  markOnboardingDone: () => void;
  incrementExportCount: () => void;
};

const DEFAULT_META: Meta = {
  schemaVersion: SCHEMA_VERSION,
  firstLaunchAt: 0,
  onboardingDone: false,
  exportCount: 0,
};

export const useMetaStore = create<MetaState>()(
  persist(
    (set) => ({
      meta: DEFAULT_META,
      markOnboardingDone: () =>
        set((s) => {
          const next: Meta = { ...s.meta, onboardingDone: true };
          // 写入 schemaVersion（独立 key）
          writeStorage('schemaVersion', SCHEMA_VERSION);
          return { meta: next };
        }),
      incrementExportCount: () =>
        set((s) => ({ meta: { ...s.meta, exportCount: s.meta.exportCount + 1 } })),
    }),
    {
      name: 'w2c.meta',
      storage: createJSONStorage(() => w2cStateStorage),
      // 启动时若 meta 不存在，自动写入 firstLaunchAt
      onRehydrateStorage: () => (state) => {
        if (state && state.meta.firstLaunchAt === 0) {
          state.meta.firstLaunchAt = Date.now();
          writeStorage('schemaVersion', SCHEMA_VERSION);
        }
      },
    },
  ),
);
