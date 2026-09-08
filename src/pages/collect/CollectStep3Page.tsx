/**
 * CollectStep3Page — src/pages/collect/CollectStep3Page.tsx
 * step3 造句：textarea + 场景提示 chip
 */

import { useNavigate } from 'react-router-dom';
import { SentenceWriter } from '@features/write-sentence';
import { useProgressStore } from '@entities/progress/model/store';

export function CollectStep3Page() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const setProgress = useProgressStore((s) => s.setProgress);

  if (!progress || !progress.word || !progress.reason || !progress.reasonFill) {
    navigate('/collect', { replace: true });
    return null;
  }

  const word = progress.word;
  const sceneIcon = progress.sceneIcon ?? '✏️';
  const reason = progress.reason;
  const reasonFill = progress.reasonFill;

  const handleConfirm = (sentence: string) => {
    setProgress({
      step: 4,
      word,
      ...(progress.sceneIcon ? { sceneIcon: progress.sceneIcon } : {}),
      ...(progress.source ? { source: progress.source } : {}),
      reason,
      reasonFill,
      ...(progress.reasonExtra ? { reasonExtra: progress.reasonExtra } : {}),
      sentence,
      updatedAt: Date.now(),
    });
    navigate('/collect/step4');
  };

  return (
    <main className="bg-bg text-deep flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-md">
        <SentenceWriter
          word={word}
          sceneIcon={sceneIcon}
          reason={reason}
          reasonFill={reasonFill}
          onConfirm={handleConfirm}
        />
      </div>
    </main>
  );
}
