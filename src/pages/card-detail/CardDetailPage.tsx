/**
 * CardDetailPage — src/pages/card-detail/CardDetailPage.tsx
 * 单卡详情：完整 step2-4 内容 + 删除按钮
 */

import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCardStore } from '@entities/card/model/store';
import { DeleteCardButton } from '@features/delete-card';
import { Card } from '@shared/ui/Card';

export function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const card = useCardStore((s) => s.cards.find((c) => c.id === id));
  const deleteCard = useCardStore((s) => s.deleteCard);

  if (!card) {
    return (
      <main className="bg-bg text-deep flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-deep/60">这张卡不存在或已被删除</p>
        <Link to="/" className="text-primary underline">
          回到卡墙
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-bg text-deep flex min-h-screen flex-col gap-6 p-6">
      <button
        onClick={() => navigate('/')}
        className="text-deep/60 hover:text-deep inline-flex min-h-touch items-center gap-1 self-start text-sm"
      >
        ← 返回卡墙
      </button>

      <Card>
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {card.sceneIcon}
          </span>
          <h1 className="text-2xl font-bold">{card.word}</h1>
        </div>
        <p className="text-deep/50 mt-1 text-sm">{card.source}</p>
      </Card>

      <Card>
        <h2 className="text-deep/60 text-sm">理由</h2>
        <p className="mt-1">
          <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-sm">
            {card.reason}
          </span>
        </p>
        <p className="text-deep mt-2 text-base">{card.reasonFill}</p>
        {card.reasonExtra && <p className="text-deep/70 mt-2 text-sm">补充：{card.reasonExtra}</p>}
      </Card>

      <Card>
        <h2 className="text-deep/60 text-sm">句子</h2>
        <p className="mt-1 text-base">{card.sentence}</p>
      </Card>

      <Card>
        <h2 className="text-deep/60 text-sm">段落</h2>
        <p className="mt-1 text-base">{card.paragraph}</p>
        {card.expandHints.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {card.expandHints.map((h) => (
              <span key={h} className="bg-accent/20 text-deep rounded-md px-2 py-0.5 text-xs">
                + {h}
              </span>
            ))}
          </div>
        )}
      </Card>

      <p className="text-deep/40 text-center text-xs">
        {new Date(card.createdAt).toLocaleString('zh-CN')}
      </p>

      <DeleteCardButton onConfirm={() => deleteCard(card.id)} />
    </main>
  );
}
