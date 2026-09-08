/**
 * CardWall — src/widgets/card-wall/ui/CardWall.tsx
 * 卡墙网格：3 列卡片布局，按 createdAt 倒序
 */

import { useNavigate } from 'react-router-dom';
import { useCardStore } from '@entities/card/model/store';
import { LoopCard } from './LoopCard';

export function CardWall() {
  const navigate = useNavigate();
  const cards = useCardStore((s) => s.cards);

  if (cards.length === 0) {
    return (
      <div className="text-deep/60 rounded-lg border-2 border-dashed border-deep/20 p-8 text-center text-sm">
        还没有闭环卡。点上面"再攒 1 张"，走完 4 步就有啦！
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <LoopCard key={card.id} card={card} onClick={() => navigate(`/card/${card.id}`)} />
      ))}
    </div>
  );
}
