/**
 * Card — src/shared/ui/Card.tsx
 * 基础卡片容器：米白底 + 大圆角 + 柔和阴影
 */

import type { HTMLAttributes } from 'react';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'className'> & {
  className?: string;
  children: React.ReactNode;
};

export function Card({ className = '', children, ...rest }: Props) {
  return (
    <div className={`bg-bg-soft text-deep rounded-lg p-6 shadow-soft ${className}`} {...rest}>
      {children}
    </div>
  );
}
