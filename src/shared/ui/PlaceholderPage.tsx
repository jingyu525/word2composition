/**
 * 通用占位页 — 临时用于 5 个路由可达性验证
 * Sprint 3+ 会逐步替换为真实业务组件
 */

type Props = {
  title: string;
  route: string;
  description: string;
};

export function PlaceholderPage({ title, route, description }: Props) {
  return (
    <main className="bg-bg text-deep flex min-h-screen items-center justify-center p-6">
      <div className="bg-bg-soft rounded-lg shadow-soft max-w-md p-8 text-center">
        <p className="text-sm text-deep/50">路由</p>
        <code className="bg-primary/10 text-primary mt-1 inline-block rounded-md px-3 py-1 text-base font-mono">
          {route}
        </code>
        <h1 className="mt-4 text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-base text-deep/70">{description}</p>
      </div>
    </main>
  );
}
