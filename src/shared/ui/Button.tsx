/**
 * Button — src/shared/ui/Button.tsx
 * 绘本风按钮，4 种 variant × 3 种 size
 * 设计令牌：触摸区 ≥ 44px、圆角 ≥ 16px、字号 ≥ 16px
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

const VARIANT: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
  secondary: 'bg-sky text-deep hover:bg-sky/80 active:bg-sky/70',
  danger: 'bg-pink text-white hover:bg-pink/90 active:bg-pink/80',
  ghost: 'bg-transparent text-deep hover:bg-bg-soft active:bg-bg-soft/80',
};

const SIZE: Record<Size, string> = {
  sm: 'px-4 py-2 text-base min-h-touch',
  md: 'px-6 py-3 text-lg min-h-touch',
  lg: 'px-8 py-4 text-xl min-h-touch',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...rest
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <button
      className={`${base} ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
