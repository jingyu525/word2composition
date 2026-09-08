/**
 * CollectPage — src/pages/collect/CollectPage.tsx
 * 闭环 4 步入口 + 断点续做（自动跳到 progress 当前步骤）
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WordSelector } from '@features/select-word';
import { CollectShell } from '@widgets/collect-shell';
import { useProgressStore } from '@entities/progress/model/store';
import { useWordStore } from '@entities/word/model/store';

export function CollectPage() {
  const navigate = useNavigate();
  const seeds = useWordStore((s) => s.seeds);
  const setProgress = useProgressStore((s) => s.setProgress);
  const progress = useProgressStore((s) => s.progress);

  // 断点续做：若有未完成的 progress，自动跳到对应 step
  useEffect(() => {
    if (!progress?.word) return;
    if (progress.step === 2) navigate('/collect/step2', { replace: true });
    else if (progress.step === 3) navigate('/collect/step3', { replace: true });
    else if (progress.step === 4) navigate('/collect/step4', { replace: true });
  }, [progress, navigate]);

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
    <CollectShell current={1}>
      <WordSelector seeds={seeds} onSelect={handleSelect} />
    </CollectShell>
  );
}
