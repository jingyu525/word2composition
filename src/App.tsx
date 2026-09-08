import { AppRouter } from './app/router';

/**
 * App 入口：仅渲染路由
 * 之前的"绘本风 demo"已被 FSD 路由替换（PR-2.1）
 */
export default function App() {
  return <AppRouter />;
}
