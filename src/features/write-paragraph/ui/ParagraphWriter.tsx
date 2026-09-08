/**
 * ParagraphWriter — src/features/write-paragraph/ui/ParagraphWriter.tsx
 * step4 成段页 UI
 * - 顶部显示 step3 句子（提示起点）
 * - 3 个扩写脚手架 chip（加画面/加声音/加动作）
 * - 段落 textarea（≥30 字 且 ≥ 句子×1.5）
 */

import { useState } from 'react';
import { Chip } from '@shared/ui/Chip';
import { Button } from '@shared/ui/Button';
import type { ReasonType } from '@shared/types';

const EXPANDS = [
  { icon: '🖼️', label: '加画面' },
  { icon: '👂', label: '加声音' },
  { icon: '🏃', label: '加动作' },
];

type Props = {
  word: string;
  sceneIcon: string;
  sentence: string;
  onConfirm: (data: { paragraph: string; expandHints: ReasonType[] }) => void;
};

export function ParagraphWriter({ word, sceneIcon, sentence, onConfirm }: Props) {
  const [paragraph, setParagraph] = useState('');
  const [expandHints, setExpandHints] = useState<ReasonType[]>([]);
  const trimmed = paragraph.trim();
  const minLen = Math.max(30, Math.ceil(sentence.length * 1.5));
  const canSubmit = trimmed.length >= minLen;

  const toggleHint = (reason: ReasonType) => {
    setExpandHints((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason],
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-deep/50">第 4 步 / 共 4 步</p>
        <h1 className="text-2xl font-bold">🎉 恭喜！就差最后一步</h1>
      </header>

      <div className="bg-bg-soft text-deep rounded-md p-3 text-base">
        <p className="text-deep/50 mb-1 text-xs">你的句子</p>
        <p>
          <span aria-hidden="true">{sceneIcon}</span> <strong>{word}</strong>：{sentence}
        </p>
      </div>

      <p className="text-deep/80 text-center text-base">再加几句话，让它变成一段话！</p>

      <div className="flex flex-wrap justify-center gap-2">
        {EXPANDS.map((e) => (
          <Chip
            key={e.label}
            icon={e.icon}
            selected={expandHints.some((r) => r === e.label)}
            onClick={() => toggleHint(e.label as ReasonType)}
          >
            {e.label}
          </Chip>
        ))}
      </div>

      <textarea
        value={paragraph}
        onChange={(e) => setParagraph(e.target.value)}
        placeholder="把句子扩写成一个段落..."
        rows={6}
        maxLength={500}
        className="border-deep/20 text-deep placeholder:text-deep/40 rounded-md border-2 bg-bg p-3 text-lg focus:border-primary focus:outline-none"
      />

      <div className="flex items-center justify-between text-sm text-deep/60">
        <span>
          已写 {trimmed.length} / {minLen}+ 字
        </span>
        {!canSubmit && <span className="text-pink">再加一点点就能攒卡啦</span>}
      </div>

      <Button
        onClick={() => onConfirm({ paragraph: trimmed, expandHints })}
        disabled={!canSubmit}
        size="lg"
        className="w-full"
      >
        🎉 完成！攒 1 张卡
      </Button>
    </div>
  );
}
