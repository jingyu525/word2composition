/**
 * CollectStep4Page — src/pages/collect/CollectStep4Page.tsx
 * step4 成段：扩写脚手架 + 完成判定
 * 完成后写入 Card、清 progress、导航到 /collect/done
 */

import { useNavigate } from 'react-router-dom';
import { ParagraphWriter } from '@features/write-paragraph';
import { useProgressStore } from '@entities/progress/model/store';
import { useCardStore } from '@entities/card/model/store';
import { getWeekKey } from '@shared/lib/weekKey';
import type { ReasonType } from '@shared/types';

export function CollectStep4Page() {
  const navigate = useNavigate();
  const progress = useProgressStore((s) => s.progress);
  const clearProgress = useProgressStore((s) => s.clearProgress);
  const addCard = useCardStore((s) => s.addCard);

  if (
    !progress ||
    !progress.word ||
    !progress.reason ||
    !progress.reasonFill ||
    !progress.sentence
  ) {
    navigate('/collect', { replace: true });
    return null;
  }

  const word = progress.word;
  const sceneIcon = progress.sceneIcon ?? '✏️';
  const sentence = progress.sentence;
  const reason = progress.reason;
  const reasonFill = progress.reasonFill;

  const handleConfirm = (data: { paragraph: string; expandHints: ReasonType[] }) => {
    const now = Date.now();
    addCard({
      id: crypto.randomUUID(),
      word,
      sceneIcon,
      source: progress.source ?? '自创',
      reason,
      reasonFill,
      ...(progress.reasonExtra ? { reasonExtra: progress.reasonExtra } : {}),
      sentence,
      paragraph: data.paragraph,
      expandHints: data.expandHints,
      createdAt: now,
      weekKey: getWeekKey(new Date(now)),
    });
    clearProgress();
    navigate('/collect/done');
  };

  return (
    <main className="bg-bg text-deep flex min-h-screen flex-col p-6">
      <div className="mx-auto w-full max-w-md">
        <ParagraphWriter
          word={word}
          sceneIcon={sceneIcon}
          sentence={sentence}
          onConfirm={handleConfirm}
        />
      </div>
    </main>
  );
}
