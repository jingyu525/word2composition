/**
 * StepProgressBar — src/widgets/step-progress/ui/StepProgressBar.tsx
 * 4 步进度条，圆点 + 标签，已完成/当前/未来三态
 */

type Props = {
  current: 1 | 2 | 3 | 4;
};

const STEPS = [
  { n: 1, label: '标记' },
  { n: 2, label: '说清' },
  { n: 3, label: '造句' },
  { n: 4, label: '成段' },
] as const;

export function StepProgressBar({ current }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
        return (
          <div key={s.n} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                done
                  ? 'bg-secondary text-white'
                  : active
                    ? 'bg-primary text-white'
                    : 'bg-bg-soft text-deep/40'
              }`}
              aria-current={active ? 'step' : undefined}
            >
              {done ? '✓' : s.n}
            </div>
            <span className={`text-sm ${active ? 'font-bold text-deep' : 'text-deep/50'}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-1 h-0.5 w-6 ${done ? 'bg-secondary' : 'bg-bg-soft'}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
