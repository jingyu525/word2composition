/**
 * CollectPage — src/pages/collect/CollectPage.tsx
 * 闭环 4 步的 step1 入口
 * - 显示 WordSelector
 * - 选词后写入 progressStore，导航到 step2
 * - 后续 PR 会逐步加 step2-4
 */

import { useNavigate } from 'react-router-dom';
import { WordSelector } from '@features/select-word';
import { useProgressStore } from '@entities/progress/model/store';
import { useWordStore } from '@entities/word/model/store';

export function CollectPage() {
  const navigate = useNavigate();
  const seeds = useWordStore((s) => s.seeds);
  const setProgress = useProgressStore((s) => s.setProgress);

  const handleSelect = (word: { word: string; sceneIcon: string; source: string }) => {
    setProgress({
      step: 2,
      word: word.word,
      sceneIcon: word.sceneIcon,
      source: word.source,
      updatedAt: Date.now(),
    });
    navigate('/collect/step2');
  };

  return (
    <main className="bg-bg text-deep flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-md">
        <WordSelector seeds={seeds} onSelect={handleSelect} />
      </div>
    </main>
  );
}
