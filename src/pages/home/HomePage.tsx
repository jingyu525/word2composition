import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaStore } from '@entities/meta/model/store';
import { PlaceholderPage } from '@shared/ui/PlaceholderPage';

export function HomePage() {
  const navigate = useNavigate();
  const onboardingDone = useMetaStore((s) => s.meta.onboardingDone);
  const [hydrated, setHydrated] = useState(useMetaStore.persist.hasHydrated());

  useEffect(() => {
    if (useMetaStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useMetaStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  // 首次启动兜底：未完成 onboarding 跳 /onboarding
  useEffect(() => {
    if (hydrated && !onboardingDone) {
      navigate('/onboarding', { replace: true });
    }
  }, [hydrated, onboardingDone, navigate]);

  if (!hydrated) return null;
  if (!onboardingDone) return null;

  return (
    <PlaceholderPage
      title="卡墙主页"
      route="/"
      description="顶部统计 + 再攒 1 张 CTA + 卡墙网格 — Sprint 4 实现"
    />
  );
}
