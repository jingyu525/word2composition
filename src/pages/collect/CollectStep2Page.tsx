/**
 * CollectStep2Page — src/pages/collect/CollectStep2Page.tsx
 * step2 说清：6 角度 chip + 填空模板
 */

import { useNavigate } from 'react-router-dom';
import { ReasonSelector } from '@features/explain-reason';
import { useProgressStore } from '@entities/progress/model/store';
import type { ReasonType } from '@shared/types';

export function CollectStep2Page() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const setProgress = useProgressStore((s) => s.setProgress);

  if (!progress || !progress.word) {
    navigate('/collect', { replace: true });
    return null;
  }

  // narrow 后的本地变量
  const word = progress.word;
  const sceneIcon = progress.sceneIcon ?? '✏️';

  const handleConfirm = (data: {
    reason: ReasonType;
    reasonFill: string;
    reasonExtra?: string;
  }) => {
    setProgress({
      step: 3,
      word,
      ...(progress.sceneIcon ? { sceneIcon: progress.sceneIcon } : {}),
      ...(progress.source ? { source: progress.source } : {}),
      reason: data.reason,
      reasonFill: data.reasonFill,
      ...(data.reasonExtra ? { reasonExtra: data.reasonExtra } : {}),
      updatedAt: Date.now(),
    });
    navigate('/collect/step3');
  };

  return (
    <main className="bg-bg text-deep flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-md">
        <ReasonSelector word={word} sceneIcon={sceneIcon} onConfirm={handleConfirm} />
      </div>
    </main>
  );
}
