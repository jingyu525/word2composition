/**
 * CompletionCelebration — src/widgets/completion-modal/ui/CompletionCelebration.tsx
 * 完成弹窗：彩纸动效 + 卡片预览 + 两个出口
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { useCardStore } from '@entities/card/model/store';

/**
 * 彩纸动画：CSS keyframes 实现 12 个圆点从顶部飘落
 */
function Confetti() {
  const colors = ['#FF9F45', '#4ECDC4', '#FFD93D', '#FF6B9D', '#95E1D3'];
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    color: colors[i % colors.length] ?? '#FF9F45',
    rotate: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function CompletionCelebration() {
  const navigate = useNavigate();
  const latestCard = useCardStore((s) => s.cards[0]);
  const [autoHome] = useState(() => setTimeout(() => navigate('/'), 8000));

  useEffect(() => {
    return () => clearTimeout(autoHome);
  }, [autoHome]);

  if (!latestCard) {
    return (
      <main className="bg-bg text-deep flex min-h-screen items-center justify-center p-6">
        <p>未找到闭环卡</p>
      </main>
    );
  }

  return (
    <>
      <Confetti />
      <main className="bg-bg text-deep flex min-h-screen items-center justify-center p-6">
        <div className="flex max-w-md flex-col items-center gap-6">
          <h1 className="text-3xl font-bold">🎉 恭喜你，完成第 1 张闭环卡！</h1>
          <p className="text-deep/70 text-center text-base">
            这段话用了
            <span aria-hidden="true"> {latestCard.sceneIcon} </span>
            <strong className="text-primary">{latestCard.word}</strong>
            ，因为有<strong>{latestCard.reason}</strong>
          </p>
          <Card className="w-full">
            <p className="text-deep/50 text-xs">句子</p>
            <p className="text-lg">{latestCard.sentence}</p>
            <hr className="border-deep/10 my-3" />
            <p className="text-deep/50 text-xs">段落</p>
            <p className="text-base">{latestCard.paragraph}</p>
            <hr className="border-deep/10 my-3" />
            <p className="text-deep/40 text-xs">
              {new Date(latestCard.createdAt).toLocaleString('zh-CN')}
            </p>
          </Card>
          <div className="flex w-full gap-3">
            <Button
              onClick={() => navigate('/collect')}
              variant="secondary"
              size="md"
              className="flex-1"
            >
              再攒 1 张
            </Button>
            <Button onClick={() => navigate('/')} variant="primary" size="md" className="flex-1">
              看看我的卡墙
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
