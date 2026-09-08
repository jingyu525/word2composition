/**
 * DeleteCardButton — src/features/delete-card/ui/DeleteCardButton.tsx
 * 删除闭环卡按钮 + Modal 二次确认
 */

import { useState } from 'react';
import { Button } from '@shared/ui/Button';
import { Modal } from '@shared/ui/Modal';

type Props = {
  onConfirm: () => void;
};

export function DeleteCardButton({ onConfirm }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="danger" size="md" className="w-full">
        🗑 删除这张卡
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-bold">确定要删除这张卡吗？</h2>
        <p className="text-deep/70 mt-2 text-base">删除后无法恢复。要不要先想想？</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => setOpen(false)} variant="ghost" size="md" className="flex-1">
            取消
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            variant="danger"
            size="md"
            className="flex-1"
          >
            确定删除
          </Button>
        </div>
      </Modal>
    </>
  );
}
