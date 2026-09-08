/**
 * 路由配置 — src/app/router.tsx
 * HashRouter（兼容纯静态托管），5 页面 + SplashGuard + fallback
 */

import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMetaStore } from '@entities/meta/model/store';
import { OnboardingPage } from '@pages/onboarding';
import { HomePage } from '@pages/home';
import {
  CollectPage,
  CollectStep2Page,
  CollectStep3Page,
  CollectStep4Page,
  CollectDonePage,
} from '@pages/collect';
import { CardDetailPage } from '@pages/card-detail';
import { SettingsPage } from '@pages/settings';

/**
 * SplashGuard：未完成 onboarding → 跳 /onboarding
 * 已完成 → 跳 /（让 HomePage 渲染）
 * 一次性跳转（用 ref 防止循环）
 */
function SplashGuard() {
  const navigate = useNavigate();
  const onboardingDone = useMetaStore((s) => s.meta.onboardingDone);

  useEffect(() => {
    if (!onboardingDone) {
      navigate('/onboarding', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 仅首次渲染时跳转

  return null;
}

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/collect" element={<CollectPage />} />
        <Route path="/collect/step2" element={<CollectStep2Page />} />
        <Route path="/collect/step3" element={<CollectStep3Page />} />
        <Route path="/collect/step4" element={<CollectStep4Page />} />
        <Route path="/collect/done" element={<CollectDonePage />} />
        <Route path="/card/:id" element={<CardDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/splash" element={<SplashGuard />} />
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </HashRouter>
  );
}
