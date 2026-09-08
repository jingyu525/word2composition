# 新鲜感词语库 MVP

> 把小学 3-4 年级孩子的"好词积累"变成"好作文产出"的最小闭环数字产品

## 一句话定位

孩子读完文章 → 挑 1 个觉得"新鲜"的词 → 走完 4 步（标记/说清/造句/成段）→ 攒 1 张闭环卡。

## 快速开始

```bash
# 安装 pnpm 9+ 与 Node 20+
pnpm install
pnpm dev          # 启动 dev server → http://localhost:5173
pnpm typecheck    # tsc --noEmit
pnpm lint         # oxlint
pnpm vitest run   # 跑单测
pnpm build        # 生产构建
```

## 技术栈

| 维度   | 选型                                |
| ------ | ----------------------------------- |
| 框架   | React 19 + TypeScript 6（strict）   |
| 构建   | Vite 8                              |
| 包管理 | pnpm 11                             |
| 样式   | TailwindCSS 3（绘本风设计令牌）     |
| 路由   | React Router 6（HashRouter）        |
| 状态   | Zustand 4（persist → localStorage） |
| 测试   | Vitest 2（核心 lib 单测）           |
| Lint   | oxlint + Prettier + Commitlint      |
| Hooks  | Husky 9 + lint-staged               |

## 项目结构

```
src/
├─ app/                  # 应用初始化、路由、SplashGuard
├─ pages/                # 页面（onboarding/home/collect/card-detail/settings）
├─ widgets/              # 跨 feature UI 块（header/card-wall/collect-shell/...）
├─ features/             # 用户业务动作（select-word/explain-reason/...）
├─ entities/             # 业务实体（card/progress/meta/word 各自 store）
├─ shared/
│  ├─ ui/                # Button / Chip / Card / Modal / PlaceholderPage
│  ├─ lib/               # storage / schema / weekKey / exportImport / storeStorage
│  ├─ types/             # 全局 TS 类型
│  └─ consts/            # SEED_WORDS 种子词
└─ index.css             # Tailwind + 设计令牌 + 彩纸动画

tests/                   # Vitest 单测（lib/ 覆盖率 ≥ 80%）
```

遵循 **Feature-Sliced Design** 分层（app → pages → widgets → features → entities → shared），下层不依赖上层。

## 开发纪律

### 提交规范（Conventional Commits）

```
feat(collect): step2 说清页（6 角度 chip + 填空模板）
fix(card-store): literal null 赋值给 Progress union
chore: 集成 Husky + lint-staged
```

类型：`feat / fix / docs / style / refactor / perf / test / chore / revert / wip`
格式：`<type>(<scope>): <subject>`，subject ≤ 72 字符

### 分支命名

```
feat/collect-step2
fix/card-rating-stars
chore/eslint-config
```

### Hook 强约束

- `pre-commit`：lint-staged + tsc + vitest run --changed
- `commit-msg`：commitlint 验证

任何 commit 必须通过这两个 hook，否则无法提交（紧急情况可用 `--no-verify`，事后补合规）。

### 组件设计

每个新组件按 [Thinking in React](https://react.dev/learn/thinking-in-react) 5 步：

1. 拆组件层级
2. 静态版本先提交
3. state 最小化（DRY）
4. state 归属判定
5. 反向数据流（onChange 回调）

## 产品原则（CLAUDE.md §1）

| 原则             | 含义                                             |
| ---------------- | ------------------------------------------------ |
| **闭环优先**     | 任何功能服务于"标记 → 说清 → 造句 → 成段 → 看见" |
| **低负担**       | 不做每日打卡、不做复杂分类、不做打分排名         |
| **可见成长**     | 每张卡 = 1 段成品作文，必须可"数出来"            |
| **考试复用**     | 理由角度直接对应语文考点                         |
| **家长撤退**     | 脚手架逐步撤出，孩子独立完成                     |
| **指标对齐闭环** | 新功能必须能提升"闭环完成率"                     |

自检三问（任何新功能前必答）：

- Q1：这个功能能提升闭环完成率吗？
- Q2：只增加输入（多抄词）而不增加产出（成段）的功能 → 一律不做
- Q3：是否引入了"打卡/分类/排名"的成分？→ 一律不做

## 数据模型（CLAUDE.md §10）

核心实体：`Card`（闭环卡终态）、`Progress`（断点续做）、`SeedWord`（12 种子词）。

localStorage 键：`w2c.{cards | progress | meta | seeds | schemaVersion}`，所有键加 `w2c.` 前缀。

## 北极星指标

> 每周完成「从词语到作文」完整闭环的孩子数（去重）

验收（4 周）：≥ 8 张闭环卡、连续 2 周闭环率 > 50%。

## 关键 bug 修复记录（避免重蹈）

1. `weekKey` 时区：必须 `getUTCDate()`，本地时区会跨日
2. `progressStore` 类型：`exactOptionalPropertyTypes: true` 下 literal `null` 需双重断言
3. `storeStorage`：`getItem` 必须返回**原始 JSON 字符串**，key 不再加 `w2c.` 前缀
4. Zustand hydration：等待 `persist.hasHydrated()` 再判断 state

## 浏览器兼容

- Chrome / Safari / Edge（现代版本）
- 移动端 Safari（iOS 100vh + safe-area 已适配）
- 触屏触摸区 ≥ 44px

## 文档索引

- `CLAUDE.md` — 项目强约定（AI 行为准则）
- `产品需求.md` — 产品原始 PRD
- `~/.claude/plans/md-woolly-papert.md` — 24 PR 实施计划

## License

MIT
