/**
 * 路由配置 — src/app/router.tsx
 * HashRouter（兼容纯静态子），）5 页面 + fallback
 */

import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { OnboardingPage } from '@pages/onboarding';
import { HomePage } from '@pages/home';
import { CollectPage } from '@pages/collect';
import { CardDetailPage } from '@pages/card-detail';
import { SettingsPage } from '@pages/settings';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/collect" element={<CollectPage />} />
        <Route path="/card/:id" element={<CardDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
