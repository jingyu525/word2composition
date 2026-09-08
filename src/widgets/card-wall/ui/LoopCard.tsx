/**
 * LoopCard — src/widgets/card-wall/ui/LoopCard.tsx
 * 单张闭环卡：词 + 评级 + 句子 + 段落 + 日期
 * 点击回调 onClick（进入详情页）
 */

import { Card } from '@shared/ui/Card';
import type { Card as CardType } from '@shared/types';

type Props = {
  card: CardType;
  onClick?: () => void;
};

/**
 * ⭐ 评级规则：
 * - step3 ≥30 字 + step4 ≥80 字 + 补充框填写 → 3 星
 * - 否则 1-2 星（仅个人展示，不排名）
 */
function rateCard(card: CardType): 1 | 2 | 3 {
  const longEnough = card.sentence.length >= 30 && card.paragraph.length >= 80;
  if (longEnough && card.reasonExtra) return 3;
  if (longEnough) return 2;
  return 1;
}

export function LoopCard({ card, onClick }: Props) {
  const stars = rateCard(card);
  const date = new Date(card.createdAt);

  return (
    <Card
      onClick={onClick}
      className={onClick ? 'cursor-pointer transition-transform hover:scale-[1.02]' : ''}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            {card.sceneIcon}
          </span>
          <h3 className="text-xl font-bold">{card.word}</h3>
        </div>
        <span className="text-accent text-lg" aria-label={`${stars} 星`}>
          {'⭐'.repeat(stars)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs">
          {card.reason}
        </span>
        <span className="text-deep/50 text-xs">{card.source}</span>
      </div>

      <p className="text-deep mt-3 text-sm">
        {card.sentence.length > 30 ? `${card.sentence.slice(0, 30)}…` : card.sentence}
      </p>
      {card.paragraph.length > 0 && (
        <p className="text-deep/70 mt-1 text-xs">
          {card.paragraph.length > 60 ? `${card.paragraph.slice(0, 60)}…` : card.paragraph}
        </p>
      )}

      <p className="text-deep/40 mt-3 text-xs">{date.toLocaleDateString('zh-CN')} 完成</p>
    </Card>
  );
}
