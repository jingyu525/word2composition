/**
 * Header — src/widgets/header/ui/Header.tsx
 * 主页顶部：本周闭环 + 总计 + ⚙ 设置入口
 */

import { Link } from 'react-router-dom';
import { useCardStore } from '@entities/card/model/store';
import { getWeekKey } from '@shared/lib/weekKey';

export function Header() {
  const cards = useCardStore((s) => s.cards);
  const thisWeek = getWeekKey();
  const weekCount = cards.filter((c) => c.weekKey === thisWeek).length;
  const totalCount = cards.length;

  return (
    <header className="border-b-primary/20 bg-bg-soft/50 flex items-center justify-between gap-4 border-b p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          🦊
        </span>
        <div className="flex flex-col text-sm">
          <span className="font-bold">小朋友的卡墙</span>
          <span className="text-deep/60">
            本周 <strong className="text-primary">{weekCount}</strong> 张 · 总计{' '}
            <strong className="text-deep">{totalCount}</strong> 张
          </span>
        </div>
      </div>
      <Link
        to="/settings"
        aria-label="设置"
        className="text-deep/60 hover:text-deep inline-flex h-11 w-11 items-center justify-center rounded-full text-xl hover:bg-bg"
      >
        ⚙
      </Link>
    </header>
  );
}
