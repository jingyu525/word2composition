/**
 * SentenceWriter — src/features/write-sentence/ui/SentenceWriter.tsx
 * step3 造句页 UI
 * - 顶部回显 step2 成果
 * - textarea 写 ≥10 字
 * - 3 个场景提示 chip（切换占位符）
 */

import { useState } from 'react';
import { Chip } from '@shared/ui/Chip';
import { Button } from '@shared/ui/Button';
import type { ReasonType } from '@shared/types';

const SCENES = [
  { icon: '🍁', label: '写秋天', placeholder: '秋天来了，树叶______' },
  { icon: '🌧️', label: '写下雨', placeholder: '下雨了，______' },
  { icon: '🎒', label: '写上学', placeholder: '上学的路上，______' },
];

const DEFAULT_PLACEHOLDER = '用「' + '{{word}}' + '」写一句话…';

type Props = {
  word: string;
  sceneIcon: string;
  reason: ReasonType;
  reasonFill: string;
  onConfirm: (sentence: string) => void;
};

export function SentenceWriter({ word, sceneIcon, reason, reasonFill, onConfirm }: Props) {
  const [sentence, setSentence] = useState('');
  const [sceneIdx, setSceneIdx] = useState<number | null>(null);
  const trimmed = sentence.trim();
  const canSubmit = trimmed.length >= 10;

  const placeholder =
    sceneIdx !== null
      ? SCENES[sceneIdx]?.placeholder
      : DEFAULT_PLACEHOLDER.replace('{{word}}', word);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-sm text-deep/50">第 3 步 / 共 4 步</p>
        <div className="bg-bg-soft text-deep mx-auto flex items-center gap-2 rounded-lg px-3 py-1 text-base shadow-soft">
          <span aria-hidden="true">{sceneIcon}</span>
          <span className="font-bold">{word}</span>
          <span className="text-deep/40">→</span>
          <span>
            {reason}：<strong className="text-primary">{reasonFill}</strong>
          </span>
        </div>
        <h1 className="text-2xl font-bold">用这个词写一句话吧！</h1>
      </header>

      <textarea
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        placeholder={placeholder}
        rows={4}
        maxLength={100}
        className="border-deep/20 text-deep placeholder:text-deep/40 rounded-md border-2 bg-bg p-3 text-lg focus:border-primary focus:outline-none"
      />

      <div className="flex flex-wrap justify-center gap-2">
        {SCENES.map((s, i) => (
          <Chip
            key={s.label}
            icon={s.icon}
            selected={sceneIdx === i}
            onClick={() => setSceneIdx(sceneIdx === i ? null : i)}
          >
            {s.label}
          </Chip>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-deep/60">
        <span>已写 {trimmed.length} / 10+ 字</span>
      </div>

      <Button onClick={() => onConfirm(trimmed)} disabled={!canSubmit} size="lg" className="w-full">
        下一步 →
      </Button>
    </div>
  );
}
