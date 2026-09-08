/**
 * CardWall — src/widgets/card-wall/ui/CardWall.tsx
 * 卡墙：按 weekKey 分组、组内倒序；周标签显示卡片数
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardStore } from '@entities/card/model/store';
import { LoopCard } from './LoopCard';
import type { Card as CardType } from '@shared/types';

type WeekGroup = {
  weekKey: string;
  cards: CardType[];
};

function groupByWeek(cards: CardType[]): WeekGroup[] {
  const map = new Map<string, CardType[]>();
  for (const c of cards) {
    const arr = map.get(c.weekKey) ?? [];
    arr.push(c);
    map.set(c.weekKey, arr);
  }
  // 按 weekKey 倒序（最新周在前）
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([weekKey, cards]) => ({ weekKey, cards }));
}

export function CardWall() {
  const navigate = useNavigate();
  const cards = useCardStore((s) => s.cards);
  const groups = useMemo(() => groupByWeek(cards), [cards]);

  if (cards.length === 0) {
    return (
      <div className="text-deep/60 rounded-lg border-2 border-dashed border-deep/20 p-8 text-center text-sm">
        还没有闭环卡。点上面"再攒 1 张"，走完 4 步就有啦！
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.weekKey} className="flex flex-col gap-3">
          <h3 className="text-deep/60 flex items-baseline gap-2 text-sm">
            <span className="font-bold">{group.weekKey}</span>
            <span>· {group.cards.length} 张</span>
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.cards.map((card) => (
              <LoopCard key={card.id} card={card} onClick={() => navigate(`/card/${card.id}`)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
