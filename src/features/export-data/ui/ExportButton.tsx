/**
 * ExportButton — src/features/export-data/ui/ExportButton.tsx
 * 导出闭环卡 + 种子词为 JSON 文件
 */

import { useCardStore } from '@entities/card/model/store';
import { useWordStore } from '@entities/word/model/store';
import { useMetaStore } from '@entities/meta/model/store';
import { buildExportFile, downloadAsJSON } from '@shared/lib/exportImport';
import { Button } from '@shared/ui/Button';
import { useState } from 'react';

export function ExportButton() {
  const [done, setDone] = useState(false);
  const cards = useCardStore((s) => s.cards);
  const seeds = useWordStore((s) => s.seeds);
  const meta = useMetaStore((s) => s.meta);
  const incrementExportCount = useMetaStore((s) => s.incrementExportCount);

  const handleExport = () => {
    const data = buildExportFile({
      ...(meta.firstLaunchAt
        ? {
            profile: {
              nickname: '小朋友',
              avatar: 'fox' as const,
              createdAt: meta.firstLaunchAt,
            },
          }
        : {}),
      cards,
      seeds,
    });
    downloadAsJSON(data);
    incrementExportCount();
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <Button onClick={handleExport} variant="primary" size="md" className="w-full">
      {done ? '✓ 已导出' : `📥 导出我的卡墙（${cards.length} 张）`}
    </Button>
  );
}
