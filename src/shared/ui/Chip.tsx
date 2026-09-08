/**
 * Chip — src/shared/ui/Chip.tsx
 * 可选/选中状态的胶囊按钮，用于理由角度、场景提示等
 * 选中态：金色描边 + 浅橙底；未选中：浅米底
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  selected?: boolean;
  icon?: string;
  className?: string;
  children: ReactNode;
};

export function Chip({ selected = false, icon, className = '', children, ...rest }: Props) {
  const stateStyle = selected
    ? 'bg-primary/10 text-primary border-2 border-primary'
    : 'bg-bg-soft text-deep border-2 border-transparent hover:bg-bg-soft/80';
  return (
    <button
      type="button"
      className={`inline-flex min-h-touch items-center gap-1 rounded-md px-4 py-2 text-lg transition-all active:scale-95 ${stateStyle} ${className}`}
      {...rest}
    >
      {icon && (
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}
