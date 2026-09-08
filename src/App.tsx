/**
 * App.tsx — 临时绘本风样式验证页（PR-0.2）
 * 后续会被 FSD 路由替换（PR-2.1）
 */
const REASONS = ['画面感', '拟人', '比喻', '对比', '动词精准', '声音词'] as const

function App() {
  return (
    <main className="bg-bg text-deep flex min-h-screen items-center justify-center p-6">
      <div className="bg-bg-soft rounded-lg shadow-soft max-w-md p-8">
        <h1 className="text-2xl font-bold">新鲜感词语库</h1>
        <p className="mt-4 text-base">
          Tailwind 绘本风样式验证 ✓
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {REASONS.map((chip) => (
            <span
              key={chip}
              className="bg-primary/10 text-primary rounded-md px-3 py-1 text-base font-medium"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App