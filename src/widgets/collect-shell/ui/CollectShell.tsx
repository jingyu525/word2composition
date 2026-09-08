/**
 * CollectShell — src/widgets/collect-shell/ui/CollectShell.tsx
 * 闭环 4 步通用布局：顶部进度条 + 主内容
 */

import type { ReactNode } from 'react';
import { StepProgressBar } from '@widgets/step-progress';

type Props = {
  current: 1 | 2 | 3 | 4;
  children: ReactNode;
};

export function CollectShell({ current, children }: Props) {
  return (
    <main className="bg-bg text-deep flex min-h-screen flex-col gap-6 p-6">
      <StepProgressBar current={current} />
      <div className="mx-auto w-full max-w-md flex-1">{children}</div>
    </main>
  );
}
