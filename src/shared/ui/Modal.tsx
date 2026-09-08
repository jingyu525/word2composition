/**
 * Modal — src/shared/ui/Modal.tsx
 * 全屏遮罩 + 居中卡片，点击遮罩或 ESC 关闭
 * 用于完成弹窗、二次确认等场景
 */

import { useEffect } from 'react';
import type { ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 关闭按钮 aria-label */
  closeLabel?: string;
};

export function Modal({ open, onClose, children, closeLabel = '关闭' }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep/40 p-6"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-soft text-deep relative max-w-md rounded-xl p-8 shadow-pop">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="text-deep/50 hover:text-deep absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-bg"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
