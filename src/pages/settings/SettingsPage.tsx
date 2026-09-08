/**
 * SettingsPage — src/pages/settings/SettingsPage.tsx
 * 设置：导出 / 导入 / 清空 / 关于
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExportButton } from '@features/export-data';
import { ImportButton } from '@features/import-data';
import { useCardStore } from '@entities/card/model/store';
import { useProgressStore } from '@entities/progress/model/store';
import { Button } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { Modal } from '@shared/ui/Modal';

export function SettingsPage() {
  const navigate = useNavigate();
  const cardsCount = useCardStore((s) => s.cards.length);
  const clearCards = useCardStore((s) => s.clearCards);
  const clearProgress = useProgressStore((s) => s.clearProgress);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClear = () => {
    clearCards();
    clearProgress();
    setConfirmOpen(false);
    navigate('/');
  };

  return (
    <main className="bg-bg text-deep flex min-h-screen flex-col gap-6 p-6">
      <button
        onClick={() => navigate('/')}
        className="text-deep/60 hover:text-deep inline-flex min-h-touch items-center gap-1 self-start text-sm"
      >
        ← 返回卡墙
      </button>

      <h1 className="text-2xl font-bold">设置</h1>

      <Card className="flex flex-col gap-3">
        <h2 className="text-deep/70 text-sm">数据管理</h2>
        <ExportButton />
        <ImportButton />
        {cardsCount > 0 && (
          <Button
            onClick={() => setConfirmOpen(true)}
            variant="danger"
            size="md"
            className="w-full"
          >
            🗑 清空所有闭环卡
          </Button>
        )}
      </Card>

      <Card className="text-deep/70 text-sm">
        <h2 className="font-bold">关于</h2>
        <p className="mt-1">新鲜感词语库 MVP · v0.1.0</p>
        <p className="mt-1">一个把"好词"变成"好作文"的最小闭环产品</p>
        <p className="mt-1 text-xs">数据存在浏览器本地，建议定期导出备份。</p>
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <h2 className="text-xl font-bold">确定要清空所有数据吗？</h2>
        <p className="text-deep/70 mt-2 text-base">
          所有闭环卡都将被删除，无法恢复。建议先导出备份。
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="ghost"
            size="md"
            className="flex-1"
          >
            取消
          </Button>
          <Button onClick={handleClear} variant="danger" size="md" className="flex-1">
            确定清空
          </Button>
        </div>
      </Modal>
    </main>
  );
}
