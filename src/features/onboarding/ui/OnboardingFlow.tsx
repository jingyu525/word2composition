/**
 * OnboardingFlow — src/features/onboarding/ui/OnboardingFlow.tsx
 * 引导 3 屏：欢迎 → 演示 → 起手（点 chip 直接进 step2）
 * 完成后调用 onComplete()（标记 meta.onboardingDone + 跳转）
 */

import { useState } from 'react';
import { Button } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import type { SeedWord } from '@shared/types';

type Props = {
  seeds: readonly SeedWord[];
  onComplete: (selectedWord: { word: string; sceneIcon: string; source: string }) => void;
  onSkip: () => void;
};

const STEPS = [
  { n: 1, label: '🍂 标记' },
  { n: 2, label: '🎨 说清' },
  { n: 3, label: '✍️ 造句' },
  { n: 4, label: '📖 成段' },
];

export function OnboardingFlow({ seeds, onComplete, onSkip }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const featured = seeds.slice(0, 3);

  return (
    <main className="bg-bg text-deep relative flex min-h-screen flex-col p-6">
      {/* 顶部跳过按钮 */}
      <button
        onClick={onSkip}
        className="text-deep/50 hover:text-deep absolute right-4 top-4 inline-flex min-h-touch items-center text-sm"
      >
        跳过 →
      </button>

      {/* 屏 1 · 欢迎 */}
      {step === 1 && (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="text-7xl" aria-hidden="true">
            🦊
          </div>
          <h1 className="text-3xl font-bold">嗨，小朋友！</h1>
          <p className="text-deep/70 text-lg">
            这里是<strong>新鲜感词语库</strong>
          </p>
          <p className="text-deep/60 text-base">把课文里的好词，变成作文里的好句子 ✨</p>
          <Button onClick={() => setStep(2)} size="lg" className="w-full">
            下一步 →
          </Button>
        </div>
      )}

      {/* 屏 2 · 演示 */}
      {step === 2 && (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8">
          <h2 className="text-2xl font-bold">走完一圈，攒 1 张卡 🎉</h2>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center gap-2">
                <div className="bg-primary text-white flex h-10 w-10 items-center justify-center rounded-full font-bold">
                  {s.n}
                </div>
                {i < STEPS.length - 1 && <span className="text-primary/40 text-2xl">→</span>}
              </div>
            ))}
          </div>
          <ul className="text-deep/80 flex flex-col gap-1 text-center text-base">
            <li>
              挑一个<strong>新鲜</strong>的词
            </li>
            <li>说清它为什么新鲜</li>
            <li>用这个词写一句话</li>
            <li>扩写成一个段落</li>
          </ul>
          <div className="flex w-full gap-3">
            <Button onClick={() => setStep(1)} variant="ghost" size="md" className="flex-1">
              ← 上一步
            </Button>
            <Button onClick={() => setStep(3)} size="md" className="flex-1">
              开始攒卡 →
            </Button>
          </div>
        </div>
      )}

      {/* 屏 3 · 起手任务 */}
      {step === 3 && (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6">
          <h2 className="text-center text-2xl font-bold">先挑 1 个词开始吧！</h2>
          <p className="text-deep/60 text-center text-sm">
            点 1 个，我们一起试试（也可以跳过，自己选）
          </p>
          <div className="flex flex-col gap-3">
            {featured.map((seed) => (
              <Card
                key={seed.id}
                onClick={() =>
                  onComplete({ word: seed.word, sceneIcon: seed.sceneIcon, source: seed.source })
                }
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">
                    {seed.sceneIcon}
                  </span>
                  <div>
                    <p className="text-xl font-bold">{seed.word}</p>
                    <p className="text-deep/60 text-sm">{seed.reasonHint}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button onClick={onSkip} variant="ghost" size="md" className="w-full">
            自己选 →
          </Button>
        </div>
      )}
    </main>
  );
}
