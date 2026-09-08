import { useParams } from 'react-router-dom';
import { PlaceholderPage } from '@shared/ui/PlaceholderPage';

export function CardDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <PlaceholderPage
      title="单卡详情"
      route={`/card/${id ?? ':id'}`}
      description="完整展示 step2-4 内容 + 删除按钮 — Sprint 4 实现"
    />
  );
}
