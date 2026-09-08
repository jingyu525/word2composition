/**
 * OnboardingPage — src/pages/onboarding/OnboardingPage.tsx
 * 引导 3 屏入口
 */

import { useNavigate } from 'react-router-dom';
import { OnboardingFlow } from '@features/onboarding';
import { useMetaStore } from '@entities/meta/model/store';
import { useWordStore } from '@entities/word/model/store';
import { useProgressStore } from '@entities/progress/model/store';

export function OnboardingPage() {
  const navigate = useNavigate();
  const markOnboardingDone = useMetaStore((s) => s.markOnboardingDone);
  const seeds = useWordStore((s) => s.seeds);
  const setProgress = useProgressStore((s) => s.setProgress);

  const skip = () => {
    markOnboardingDone();
    navigate('/', { replace: true });
  };

  const complete = (selected: { word: string; sceneIcon: string; source: string }) => {
    setProgress({
      step: 2,
      word: selected.word,
      sceneIcon: selected.sceneIcon,
      source: selected.source,
      updatedAt: Date.now(),
    });
    markOnboardingDone();
    navigate('/collect/step2', { replace: true });
  };

  return <OnboardingFlow seeds={seeds} onComplete={complete} onSkip={skip} />;
}
