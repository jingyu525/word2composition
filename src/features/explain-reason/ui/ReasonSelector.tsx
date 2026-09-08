/**
 * ReasonSelector — src/features/explain-reason/ui/ReasonSelector.tsx
 * step2 说清页 UI
 * - 显示已选词（顶部）
 * - 6 个理由角度 chip
 * - 选中后填空框
 * - 补充框（选填，≥5字奖励 ⭐）
 */

import { useState } from 'react';
import { Chip } from '@shared/ui/Chip';
import { Button } from '@shared/ui/Button';
import type { ReasonType } from '@shared/types';

const REASONS: { value: ReasonType; icon: string; template: string }[] = [
  { value: '画面感', icon: '🎨', template: '让我想到 ______ 的画面' },
  { value: '拟人', icon: '🐾', template: '把 ______ 当成人来写' },
  { value: '比喻', icon: '💎', template: '把 ______ 比作 ______' },
  { value: '对比', icon: '⚖️', template: '让我想到相反的 ______' },
  { value: '动词精准', icon: '💪', template: '用 ______ 这个动作，比 ______ 更有力' },
  { value: '声音词', icon: '👂', template: '让我听到 ______ 的声音' },
];

type Props = {
  word: string;
  sceneIcon: string;
  onConfirm: (data: { reason: ReasonType; reasonFill: string; reasonExtra?: string }) => void;
};

export function ReasonSelector({ word, sceneIcon, onConfirm }: Props) {
  const [selectedReason, setSelectedReason] = useState<ReasonType | null>(null);
  const [reasonFill, setReasonFill] = useState('');
  const [reasonExtra, setReasonExtra] = useState('');

  const trimmed = reasonFill.trim();
  const canSubmit = selectedReason !== null && trimmed.length >= 2;

  const handleReason = (r: ReasonType) => {
    setSelectedReason(r);
    setReasonFill(''); // 清空避免混淆
  };

  const handleSubmit = () => {
    if (!selectedReason || !canSubmit) return;
    const data: { reason: ReasonType; reasonFill: string; reasonExtra?: string } = {
      reason: selectedReason,
      reasonFill: trimmed,
    };
    const extra = reasonExtra.trim();
    if (extra.length >= 5) data.reasonExtra = extra;
    onConfirm(data);
  };

  const template = REASONS.find((r) => r.value === selectedReason)?.template;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-deep/50">第 2 步 / 共 4 步</p>
        <div className="bg-bg-soft text-deep flex items-center gap-2 rounded-lg px-4 py-2 text-2xl font-bold shadow-soft">
          <span aria-hidden="true">{sceneIcon}</span>
          <span>{word}</span>
        </div>
        <h1 className="text-xl font-bold">说一说，为什么这个词有新鲜感？</h1>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {REASONS.map((r) => (
          <Chip
            key={r.value}
            icon={r.icon}
            selected={selectedReason === r.value}
            onClick={() => handleReason(r.value)}
          >
            {r.value}
          </Chip>
        ))}
      </div>

      {selectedReason && (
        <div className="flex flex-col gap-2">
          <label className="text-deep/70 text-base">
            {selectedReason}：{template}
          </label>
          <textarea
            value={reasonFill}
            onChange={(e) => setReasonFill(e.target.value)}
            placeholder="填一填（至少 2 个字）"
            rows={2}
            maxLength={100}
            className="border-deep/20 text-deep placeholder:text-deep/40 rounded-md border-2 bg-bg p-3 text-base focus:border-primary focus:outline-none"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-deep/60 text-sm">再多说一句？（选填，≥5 字奖励 ⭐）</label>
        <textarea
          value={reasonExtra}
          onChange={(e) => setReasonExtra(e.target.value)}
          placeholder="想多说就写点..."
          rows={2}
          maxLength={200}
          className="border-deep/20 text-deep placeholder:text-deep/40 rounded-md border-2 bg-bg p-3 text-base focus:border-primary focus:outline-none"
        />
      </div>

      <Button onClick={handleSubmit} disabled={!canSubmit} size="lg" className="w-full">
        下一步 →
      </Button>
    </div>
  );
}
