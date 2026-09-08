import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaStore } from '@entities/meta/model/store';
import { Header } from '@widgets/header';
import { CardWall } from '@widgets/card-wall';
import { Button } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';

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

  useEffect(() => {
    if (hydrated && !onboardingDone) {
      navigate('/onboarding', { replace: true });
    }
  }, [hydrated, onboardingDone, navigate]);

  if (!hydrated) return null;
  if (!onboardingDone) return null;

  return (
    <div className="bg-bg text-deep flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
        <Card className="bg-gradient-to-br from-bg-soft to-primary/10 text-center">
          <h1 className="text-2xl font-bold">准备好再攒 1 张卡吗？</h1>
          <p className="text-deep/70 mt-2 text-base">
            读完一篇文章，挑一个让你觉得<strong>新鲜</strong>的词
          </p>
          <Button onClick={() => navigate('/collect')} size="lg" className="mt-4 w-full">
            ✨ 再攒 1 张 ✨
          </Button>
        </Card>

        <section>
          <h2 className="text-deep/70 mb-3 text-sm">最近闭环卡</h2>
          <CardWall />
        </section>
      </main>
    </div>
  );
}
