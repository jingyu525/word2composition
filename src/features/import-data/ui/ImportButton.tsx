/**
 * ImportButton — src/features/import-data/ui/ImportButton.tsx
 * 选择 JSON 文件 → 校验 → 合并/替换确认 → 写入
 */

import { useRef, useState } from 'react';
import { Button } from '@shared/ui/Button';
import { Modal } from '@shared/ui/Modal';
import { parseImportFile, mergeCards, replaceCards, mergeSeeds } from '@shared/lib/exportImport';
import { useCardStore } from '@entities/card/model/store';
import { useWordStore } from '@entities/word/model/store';
import type { ExportFile } from '@shared/types';

type ImportMode = 'merge' | 'replace' | null;

export function ImportButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ExportFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  const cards = useCardStore((s) => s.cards);
  const replaceCardsStore = useCardStore((s) => s.replaceCards);
  const mergeCardsStore = (newCards: typeof cards) => {
    // 手动合并：取现有的 + newCards，去重（按 id），保留 imported 优先
    const map = new Map<string, (typeof cards)[number]>();
    for (const c of cards) map.set(c.id, c);
    for (const c of newCards) map.set(c.id, c);
    replaceCardsStore(Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt));
  };
  const seeds = useWordStore((s) => s.seeds);
  const replaceSeeds = useWordStore((s) => s.replaceSeeds);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setImported(false);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const result = parseImportFile(text);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPending(result.data);
    };
    reader.readAsText(file);
    // 清空 input value 让同样文件能再次选择
    e.target.value = '';
  };

  const handleConfirm = (mode: NonNullable<ImportMode>) => {
    if (!pending) return;
    if (mode === 'merge') {
      mergeCardsStore(mergeCards(cards, pending.cards));
      replaceSeeds(mergeSeeds(seeds, pending.seeds));
    } else {
      replaceCardsStore(replaceCards(cards, pending.cards));
      replaceSeeds(pending.seeds);
    }
    setPending(null);
    setImported(true);
    setTimeout(() => setImported(false), 2000);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button onClick={handleClick} variant="secondary" size="md" className="w-full">
        {imported ? '✓ 已导入' : '📤 导入卡墙（JSON 文件）'}
      </Button>

      {error && <p className="text-pink mt-2 text-sm">导入失败：{error}</p>}

      <Modal open={pending !== null} onClose={() => setPending(null)}>
        <h2 className="text-xl font-bold">检测到 {pending?.cards.length ?? 0} 张闭环卡</h2>
        <p className="text-deep/70 mt-2 text-base">你想怎么处理？</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={() => handleConfirm('merge')}
            variant="primary"
            size="md"
            className="w-full"
          >
            合并到现有卡墙（推荐）
          </Button>
          <Button
            onClick={() => handleConfirm('replace')}
            variant="danger"
            size="md"
            className="w-full"
          >
            替换全部卡墙
          </Button>
          <Button onClick={() => setPending(null)} variant="ghost" size="md" className="w-full">
            取消
          </Button>
        </div>
      </Modal>
    </>
  );
}
