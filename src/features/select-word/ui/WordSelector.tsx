/**
 * WordSelector — src/features/select-word/ui/WordSelector.tsx
 * step1 标记页 UI
 * - 顶部步骤提示
 * - 3 个种子词 chip（来自 useWordStore.seeds，取前 3 个）
 * - 兜底输入框
 * - onSelect(word) 回调
 */

import { useState } from 'react';
import { Chip } from '@shared/ui/Chip';
import type { SeedWord } from '@shared/types';

type Props = {
  seeds: readonly SeedWord[];
  onSelect: (word: { word: string; sceneIcon: string; source: string }) => void;
};

export function WordSelector({ seeds, onSelect }: Props) {
  const [customWord, setCustomWord] = useState('');
  const featured = seeds.slice(0, 3);
  const canSubmit = customWord.trim().length > 0;

  const handleSeed = (seed: SeedWord) => {
    onSelect({ word: seed.word, sceneIcon: seed.sceneIcon, source: seed.source });
  };

  const handleCustom = () => {
    const w = customWord.trim();
    if (!w) return;
    onSelect({ word: w, sceneIcon: '✏️', source: '自创' });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-sm text-deep/50">第 1 步 / 共 4 步</p>
        <h1 className="text-2xl font-bold">
          读完文章，挑 1 个让你觉得<strong className="text-primary">新鲜</strong>的词
        </h1>
      </header>

      <div className="flex flex-wrap justify-center gap-3">
        {featured.map((seed) => (
          <Chip key={seed.id} icon={seed.sceneIcon} onClick={() => handleSeed(seed)}>
            {seed.word}
          </Chip>
        ))}
      </div>

      <div className="border-t border-deep/10 pt-4">
        <p className="text-deep/60 mb-2 text-center text-sm">我想要别的词</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customWord}
            onChange={(e) => setCustomWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSubmit) handleCustom();
            }}
            placeholder="自己输入一个好词"
            maxLength={20}
            className="border-deep/20 text-deep placeholder:text-deep/40 min-h-touch flex-1 rounded-md border-2 bg-bg px-4 text-lg focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCustom}
            disabled={!canSubmit}
            className="bg-primary text-white min-h-touch min-w-touch rounded-md px-4 text-xl font-bold transition-colors disabled:opacity-50"
            aria-label="确认"
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}
