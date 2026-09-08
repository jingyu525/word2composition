# CLAUDE.md — 新鲜感词语库 MVP

> **本文件是 Claude Code 在此项目的强约定**。所有 AI 行为必须遵守。
> 产品原始 PRD 见 `产品需求.md`；本文件是 PRD 的工程化、可执行版本。

---

## 0. 项目一句话

把小学 3-4 年级孩子的"好词积累"变成"好作文产出"的最小闭环数字产品。

**北极星指标**：每周完成「从词语到作文」完整闭环的孩子数（去重）。
**唯一交付物入口**：`/` → 一个 React SPA，最终产物可部署到任意静态服务。

---

## 1. 产品强约束（6 条红线，违反即否决）

| # | 原则 | 含义 | 禁止示例 |
|---|---|---|---|
| 1 | **闭环优先** | 任何功能必须服务于「标记 → 说清 → 造句 → 成段 → 看见」 | 加一个"推荐书单"独立页 |
| 2 | **低负担** | 不做每日打卡、不做复杂分类、不做打分排名 | 加打卡日历 / 加排行榜 |
| 3 | **可见成长** | 每张闭环卡 = 1 段成品作文，必须可"数出来" | 把卡藏在二级菜单里 |
| 4 | **考试复用** | 理由角度直接对应语文考点 | 加抽象的"赏析写作"标签 |
| 5 | **家长撤退** | 脚手架逐步撤出，孩子独立完成 | 加家长账号 / 家长推送 |
| 6 | **指标对齐闭环** | 任何新增功能必须能提升"闭环完成率" | 加一个"快速收藏词"按钮（不闭环） |

**自检三问**（任何新功能前必答）：
- Q1：这个功能能提升闭环完成率吗？
- Q2：只增加输入（多抄词）而不增加产出（成段）的功能 → 一律不做
- Q3：是否引入了"打卡/分类/排名"的成分？→ 一律不做

---

## 2. 用户与场景

- **主用户**：小学 3-4 年级（好奇心强、喜欢集卡闯关、抽象归纳能力弱，需要脚手架）
- **次用户**：家长（不费妈、有方法、能看见进步）—— **MVP 不做家长端**
- **关键场景**：阅读课文/短文后挑词 → 写作文前调用

---

## 3. 闭环 4 步（不可变核心）

| Step | 标题 | 完成判定 | UX 关键 |
|---|---|---|---|
| 1 | **标记** | 选 1 个词 | 3 个种子 chip 3 选 1（≤30 秒）+ 兜底输入框 |
| 2 | **说清** | 选角度 + 填空 ≥ 2 字 | 6 个理由角度 chip（见 §4）+ 填空模板 |
| 3 | **造句** | ≥ 10 字 | 多行 textarea + 3 个场景提示 chip（不替写） |
| 4 | **成段** | ≥ 30 字 且 总字数 ≥ step3 × 1.5 倍 | 3 个扩写脚手架 chip（加画面/加声音/加动作） |

**只有完成 4 步才生成 Card**。`Progress` 存断点，`Card` 是终态——绝不存半成品词。

---

## 4. 6 个理由角度（考试复用，禁止增删）

| chip | 对应考点 | 填空模板 |
|---|---|---|
| 🎨 画面感 | 把抽象变具体 | "让我想到 ______ 的画面" |
| 🐾 拟人 | 让事物像人一样 | "把 ______ 当成人来写" |
| 💎 比喻 | 用 A 写 B | "把 ______ 比作 ______" |
| ⚖️ 对比 | 两个东西放一起 | "让我想到相反的 ______" |
| 💪 动词精准 | 用动作代替形容 | "用 ______ 这个动作，比 ______ 更有力" |
| 👂 声音词 | 听见画面 | "让我听到 ______ 的声音" |

**理由角度是产品核心壁垒**，调整必须经过产品评审，不允许擅自增删。

---

## 5. 12 个种子词（统编教材三上第一单元，禁止替换）

凌乱、潮湿、熨帖、憧憬、私塾、鸦雀无声、摇晃、狂欢、叮咛、绽放、好奇、出奇

每词字段：`{ id, word, sceneIcon, source, scene, reason, reasonHint, order }`
- `reasonHint` 是填空提示（**降低启动焦虑**，不是答案）
- 字段定义见 §10

---

## 6. 技术栈（锁定，禁止替换）

| 维度 | 选型 | 版本 |
|---|---|---|
| 框架 | React | ^18.3 |
| 语言 | TypeScript | ^5.5（**strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes**） |
| 构建 | Vite | ^5.4 |
| 包管理 | pnpm | ^9.0 |
| 样式 | TailwindCSS | ^3.4（自定义绘本色板 token，**禁止引入其他 UI 库**） |
| 路由 | React Router | ^6.26（**HashRouter**，兼容纯静态托管） |
| 状态 | Zustand | ^4.5（内置 `persist` 中间件接 localStorage） |
| 测试 | Vitest | ^2.0（**仅核心逻辑**，UI 不强求） |
| Lint | ESLint + typescript-eslint + react-hooks | ^9.0 |
| 格式化 | Prettier | ^3.3 |
| 提交规范 | Conventional Commits + Commitlint | — |
| Hooks | Husky + lint-staged | ^9.1 / ^15.2 |

**禁止**：Redux、MobX、styled-components、Material UI、shadcn/ui、任何 CDN 外链。

---

## 7. 工程基建（Git 管理 + 提交规范 + Hooks）

### 7.1 Git 仓库管理

| 规范 | 要求 |
|---|---|
| **初始化** | `git init` 时配置 `.gitignore`（Node + Vite + IDE + 系统文件） |
| **默认分支** | `main`（保护分支，禁止直推，PR 合并） |
| **分支策略** | GitHub Flow：`main` ← feature 分支（`feat/<scope>-<desc>`） |
| **分支命名** | `feat/collect-step1`、`fix/card-rating-stars`、`chore/eslint-config` |
| **合并策略** | Squash Merge（一个 PR 一个 commit 到 main） |
| **Tag** | MVP 上线打 `v0.1.0`（semver） |
| **CHANGELOG** | 由 `pnpm exec standard-version` 自动生成（可选） |

**禁止**：
- ❌ 长期分支（> 3 天未合并）
- ❌ 在 `main` 直接 push（必须走 PR + 至少 1 个 reviewer 或 AI 自审）
- ❌ 提交敏感信息（API key、密码）—— `.gitignore` 必须包含 `.env*`

### 7.2 提交规范（Conventional Commits）

格式：`<type>(<scope>): <subject>`

**允许 type**：

| type | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 仅文档变更 |
| `style` | 不影响代码含义（空格、格式化） |
| `refactor` | 既不修 bug 也不加功能 |
| `perf` | 性能优化 |
| `test` | 仅测试 |
| `chore` | 构建/工具/依赖 |
| `revert` | 回滚 |
| `wip` | 进行中（紧急逃生通道） |

**scope 规范**（与项目结构对应）：
- `app` / `pages` / `widgets` / `features` / `entities` / `shared`
- 或业务域：`collect` / `home` / `card-detail` / `onboarding` / `settings`
- 示例：`feat(collect): 实现 step1 标记页`

**subject 规范**：
- ≤ 72 字符
- 用动词开头（"实现"/"修复"/"补充"）
- 不加句号
- 中文 / 英文皆可，统一一种语言

### 7.3 `pre-commit` Hook（不可绕过）

1. `pnpm lint-staged`（ESLint --fix + Prettier 修复暂存文件）
2. `pnpm exec tsc --noEmit`（**类型检查 0 error**）
3. `pnpm vitest run --changed`（**改动相关测试全绿**）

### 7.4 `commit-msg` Hook（不可绕过）

- 提交信息必须符合 Conventional Commits（见 §7.2）
- subject ≤ 72 字符

### 7.5 提交节奏

- **小步提交**：单 PR ≤ 200 行 diff
- 每个 PR 独立可运行、可回滚
- 每天 ≥ 1 个 commit，避免大爆炸合并
- 24 个 PR 是上限（不允许无限切分）

### 7.6 逃生通道（仅紧急）

```bash
git commit --no-verify -m "wip: 紧急绕过"
```

**事后必须补合规 commit**。不允许长期 `--no-verify`。

---

## 8. 前端架构方法论（强约定）

### 8.1 Feature-Sliced Design (FSD) 分层

**层级**（从高到低，单向依赖）：

```
app → pages → widgets → features → entities → shared
```

| 层 | 职责 | 本项目对应 |
|---|---|---|
| **app** | 应用初始化、Provider、路由根、全局样式 | `src/app/` |
| **pages** | 完整页面，组合 widgets/features | `src/pages/`（onboarding / home / collect / card-detail / settings） |
| **widgets** | 独立 UI 块，跨 feature 组合（如 Header、CardWall） | `src/widgets/` |
| **features** | 用户能做的业务动作（start-collect、export-data） | `src/features/` |
| **entities** | 业务实体（Card、Word、Progress） | `src/entities/` |
| **shared** | 基础设施（UI kit、lib、config、types） | `src/shared/` |

**FSD 铁律**：
- ✅ 上层可依赖下层
- ❌ **下层绝不引用上层**（单向依赖）
- ❌ **同层 slice 之间不互相引用**（slice = `features/auth` 这样的完整路径）
- ✅ 每个 slice 必须有 `index.ts` 作为公共 API（仅 re-export）
- ✅ 内部实现不对外暴露（私有文件不导出）
- ✅ 代码优先放最底层，需要时再上提

**每个 slice 内部可分 segment**：
- `ui/` — UI 组件
- `model/` — 业务逻辑、store、类型
- `lib/` — 辅助函数
- `api/` — 数据请求
- `config/` — 配置
- `consts/` — 常量
- `index.ts` — 公共 API（强制）

### 8.2 Thinking in React（React 官方方法论）

**所有新组件必须按这 5 步设计**（来源：https://react.dev/learn/thinking-in-react）：

| Step | 核心问题 | 关键原则 |
|---|---|---|
| **1. Break the UI into a component hierarchy** | 如何把 UI 拆分成组件？ | 围绕 mockup 画框 → 命名组件；**separation of concerns**：一个组件只做一件事 |
| **2. Build a static version in React** | 先实现没有交互的 UI 版本 | 用 **props 传数据，禁止 state**；自上而下或自下而上；单向数据流 |
| **3. Find the minimal but complete representation of UI state** | 哪些数据真正是 state？ | **DRY**：非 state 的三条规则——始终不变？→ 不是；props 传入？→ 不是；可由已有 state/props 计算？→ **一定不是** |
| **4. Identify where your state should live** | state 应该归属哪个组件？ | 找依赖此 state 的所有组件 → 找最近共同父 → 放共同父（必要时新建组件持有） |
| **5. Add inverse data flow** | 如何让深层子组件更新顶层 state？ | 顶层把 **setter 作为 props** 向下传；子组件用 `onChange` 等回调调用 |

**强制实践**：
- 新增任何 UI → 先按 Step 1 画组件层级图（即使是脑图）
- Step 2 静态版本必须先提交（commit: `wip(ui): 静态结构`）再做交互
- state 必须经过 Step 3 三条规则验证才放入 `useState` / Zustand
- 写 `value` 时必须配套 `onChange`（Step 5 反向数据流，否则控制台警告）

---

## 9. 项目结构（FSD 分层）

```
word2composition/
├─ .husky/                              # Git hooks
├─ src/
│  ├─ app/                              # FSD: 应用初始化
│  │  ├─ providers/                     # 全局 Provider
│  │  ├─ router.tsx                     # HashRouter 配置
│  │  ├─ styles/                        # 全局样式（Tailwind）
│  │  └─ index.tsx                      # 入口（main.tsx 调用）
│  ├─ pages/                            # FSD: 完整页面
│  │  ├─ onboarding/                    # 引导 3 屏
│  │  ├─ home/                          # 卡墙主页
│  │  ├─ collect/                       # 闭环 4 步（4 个子页）
│  │  ├─ card-detail/                   # 单卡详情
│  │  └─ settings/                      # 设置
│  ├─ widgets/                          # FSD: 跨 feature UI 块
│  │  ├─ header/                        # 顶部统计 + ⚙
│  │  ├─ card-wall/                     # 卡墙网格
│  │  ├─ step-progress/                 # 4 步进度条
│  │  ├─ confetti/                      # 庆祝动效
│  │  └─ completion-modal/              # 完成弹窗
│  ├─ features/                         # FSD: 用户业务动作
│  │  ├─ start-collect/                 # 启动闭环
│  │  ├─ select-word/                   # step1 选词
│  │  ├─ explain-reason/                # step2 说清
│  │  ├─ write-sentence/                # step3 造句
│  │  ├─ write-paragraph/               # step4 成段
│  │  ├─ export-data/                   # 导出 JSON
│  │  ├─ import-data/                   # 导入 JSON
│  │  └─ delete-card/                   # 删除闭环卡
│  ├─ entities/                         # FSD: 业务实体
│  │  ├─ card/                          # Card 实体（store + types + ui）
│  │  ├─ word/                          # 种子词实体
│  │  └─ progress/                      # 断点实体
│  └─ shared/                           # FSD: 基础设施
│     ├─ ui/                            # 通用组件（Button / Chip / Modal）
│     ├─ lib/                           # 纯函数（storage / weekKey / exportImport / schema）
│     ├─ config/                        # 路由配置、localStorage 键
│     ├─ types/                         # 全局 TS 类型
│     └─ consts/                        # 常量（6 个理由角度、12 个种子词）
├─ tests/                                # Vitest 单测（src/shared/lib/ 覆盖率 ≥ 80%）
├─ 配置文件（根目录，详见 §6）
└─ 产品需求.md / CLAUDE.md
```

**强约束**：
- ❌ 跨层引用（如 `shared/` 引用 `features/`）→ ESLint 规则禁止
- ❌ 同 slice 跨目录互引用（`features/a` 引用 `features/b`）→ ESLint 规则禁止
- ❌ 私有文件跨 slice 暴露 → 每个 slice 必须用 `index.ts` 收口
- ✅ `shared/lib/` 必须是**纯函数**，禁止依赖 React / DOM
- ✅ Zustand store 放在对应 entity 的 `model/` segment

---

## 10. 数据模型（强类型，禁止弱化）

```ts
// src/shared/types/index.ts
export type ReasonType =
  | '画面感' | '拟人' | '比喻' | '对比' | '动词精准' | '声音词'

export type SeedWord = {
  id: string
  word: string
  sceneIcon: string
  source: string
  scene: string
  reason: ReasonType
  reasonHint: string
  order: number
}

export type Card = {
  id: string                  // crypto.randomUUID()
  word: string
  sceneIcon: string
  source: string
  reason: ReasonType
  reasonFill: string          // step2 填空
  reasonExtra?: string        // step2 补充（选填）
  sentence: string            // step3
  paragraph: string           // step4
  expandHints: ReasonType[]   // step4 用的脚手架
  createdAt: number
  weekKey: string             // "2026-W36"
}

export type Progress = {
  step: 1 | 2 | 3 | 4
  word?: string
  sceneIcon?: string
  source?: string
  reason?: ReasonType
  reasonFill?: string
  reasonExtra?: string
  sentence?: string
  expandHints?: ReasonType[]
  updatedAt: number
} | null
```

**localStorage 键**（定义在 `src/shared/config/storage.ts`）：
- `w2c.schemaVersion` → `"1.0"`
- `w2c.profile` → `{ nickname, avatar, createdAt }`
- `w2c.seeds` → `SeedWord[]`
- `w2c.cards` → `Card[]`
- `w2c.progress` → `Progress | null`
- `w2c.meta` → `{ schemaVersion, firstLaunchAt, onboardingDone, exportCount }`

---

## 11. 视觉令牌（Tailwind 扩展，禁止另起）

```ts
// tailwind.config.ts extend.colors
{
  primary:   '#FF9F45',   // 暖橙
  secondary: '#4ECDC4',   // 薄荷绿
  accent:    '#FFD93D',   // 阳光黄
  deep:      '#5B5F97',   // 静谧紫
  pink:      '#FF6B9D',
  sky:       '#95E1D3',
  bg:        '#FFF9F0',   // 米白底
  'bg-soft': '#FFF3E0',
}
```

字体栈：`'PingFang SC', 'Hiragino Sans GB', system-ui, sans-serif`（**无外链字体**）
字号比常规大 20%（8 岁孩子友好）
圆角 ≥ 16px（绘本大圆角）

---

## 12. 验收清单

> 验收分两层：**产品验收**（产品上线 / 阶段复盘用）+ **工程验收**（每个 PR 合并前用）。
> 产品验收直接对应 `产品需求.md §6.4` 的分阶指标。

### A. 产品验收（功能层 · 上线前必须全绿）

#### A1. 闭环完整性（防灌水，守护北极星）
- [ ] **A1.1** step1→step2→step3→step4 流程**不可跳过**（无 next/prev 直跳入口）
- [ ] **A1.2** 只有 4 步**全部完成**才生成 `Card` 写入 `w2c.cards`
- [ ] **A1.3** step1 输入框只接受**1 个词**（不是词表）
- [ ] **A1.4** `w2c.progress` 是断点（仅 1 份），`w2c.cards` 是终态（数组）

#### A2. 闭环 4 步完成判定（精确口径）
- [ ] **A2.1** step2：选角度 chip **+** 填空 `reasonFill.length ≥ 2` 字
- [ ] **A2.2** step3：`sentence.length ≥ 10` 字
- [ ] **A2.3** step4：`paragraph.length ≥ 30` 字 **且** `paragraph.length ≥ sentence.length × 1.5`
- [ ] **A2.4** 不满足条件时，"下一步/完成"按钮**置灰**且有提示文案

#### A3. 低负担（无打卡、无排名、无分类）
- [ ] **A3.1** 全产品代码 + 文案 grep `打卡|签到|排名|排行榜` → **0 结果**
- [ ] **A3.2** 无"分类/筛选/标签管理"独立入口
- [ ] **A3.3** 卡片 ⭐ 评级仅**个人展示**，无跨孩子/班级对比
- [ ] **A3.4** step1 种子 chip 3 选 1 实测 < 5 秒（DevTools 性能录制验证）
- [ ] **A3.5** 8 岁孩子可独立操作（无复杂表单、无 keyboard 快捷键依赖）

#### A4. 可见成长（北极星可视化）
- [ ] **A4.1** home 顶部统计 `本周闭环 X 张`（= 北极星周维度）
- [ ] **A4.2** home 顶部统计 `总计 X 张`
- [ ] **A4.3** 完成弹窗有**彩纸动效**（Confetti 组件 ≥ 1.5s）
- [ ] **A4.4** 卡墙按 `weekKey` 分组、倒序展示
- [ ] **A4.5** 单卡可点开查看完整 step2-4 内容（可追溯）

#### A5. 考试复用（理由角度 = 考点）
- [ ] **A5.1** 6 个理由角度 chip 全部呈现：🎨画面感 / 🐾拟人 / 💎比喻 / ⚖️对比 / 💪动词精准 / 👂声音词
- [ ] **A5.2** 每个 chip 对应"填空模板"在选中后展示
- [ ] **A5.3** step3 顶部**回显** step2 成果："🍂 凌乱 → 因为有画面感：______"
- [ ] **A5.4** "💡 举个例子"按钮仅展示**填空示范**，不展示完整答案

#### A6. 家长撤退（MVP 不做家长端）
- [ ] **A6.1** 全产品无家长账号 / 登录 / 注册入口
- [ ] **A6.2** 引导完成后，孩子可**不依赖家长**走完 4 步
- [ ] **A6.3** 设置页有"导出 JSON"按钮，让家长**被动**拿到数据
- [ ] **A6.4** 无家长推送 / 通知 / 邮件订阅

#### A7. 冷启动（首因体验）
- [ ] **A7.1** 首次启动出现引导 3 屏（欢迎 / 演示 / 起手）
- [ ] **A7.2** 引导屏 3 直接接闭环（点种子 chip → 进入 step2）
- [ ] **A7.3** 种子词 **≥ 10 个**（已预置 12）
- [ ] **A7.4** 引导完成 30 秒内可完成首个 step2（埋点或录屏验证）

#### A8. 数据完整性
- [ ] **A8.1** 刷新页面后 `w2c.cards` / `w2c.progress` / `w2c.meta` 全部保留
- [ ] **A8.2** 导出 JSON 文件含 `schemaVersion / exportedAt / profile / cards / seeds` 5 个字段
- [ ] **A8.3** 导入合并按 `id` 去重；导入替换需二次确认
- [ ] **A8.4** `schemaVersion` 不匹配时**拒绝导入**并提示
- [ ] **A8.5** "清空所有数据"按钮需二次确认（防止误触）

---

### B. 产品分阶验收标准（对应 PRD §6.4，对应北极星指标）

> 这些是产品上线后**实际运营**才能验证的指标，但**埋点 / 统计字段必须在 MVP 中预留**。

| 阶段 | 指标 | 目标值 | 埋点字段 |
|---|---|---|---|
| **首周（激活）** | 新用户首次闭环完成率 | **> 60%** | `meta.firstClosedAt - meta.firstLaunchAt` |
| | 完成首张闭环卡的孩子数 | ≥ 1 | `cards.length > 0` |
| **4 周（习惯）** | 累计闭环完成数 | **≥ 8 张** | `cards.length` |
| | 连续 2 周闭环率 | **> 50%** | 按 `weekKey` 分组计数 |
| **1 学期（坚持）** | 累计闭环完成数 | **≥ 30 张** | `cards.length` |
| | 月活闭环率 | **稳定** | 周维度闭环数 ≥ 月度均值 |

**单孩子可视化标准**（4 周）：
> 一个普通孩子，用 4 周，攒下 **≥ 8 张闭环卡**、产出 **≥ 8 段好作文**。

---

### C. 工程验收（每个 PR 合并前必须全绿）

#### C1. 代码质量
- [ ] `pnpm exec tsc --noEmit` **0 error**（strict 模式）
- [ ] `pnpm lint` **0 warning**
- [ ] `pnpm vitest run --changed` **全绿**（改动相关测试）
- [ ] `lib/` 纯函数覆盖率 **≥ 80%**

#### C2. 架构合规（Thinking in React + FSD）
- [ ] 新组件按 Thinking in React 5 步设计（至少 Step 1 已画脑图）
- [ ] UI 静态版本先提交（commit `wip(ui):`），再加交互
- [ ] state 经 Step 3 三条规则验证后才放进 `useState` / Zustand
- [ ] 新文件落点符合 FSD 分层（不放在错误的层）
- [ ] **没有跨层引用**（如 `shared → features`、`entities → widgets`）
- [ ] 每个 slice 的 `index.ts` 收口公共 API，私有文件不导出

#### C3. Git 与提交
- [ ] 提交信息符合 Conventional Commits（`feat(collect): 实现 step1 标记页`）
- [ ] 单 PR diff **≤ 200 行**
- [ ] 分支命名符合 `feat/<scope>-<desc>` 规范
- [ ] Squash Merge 到 `main`
- [ ] commit 频率 ≥ 1 次/天（避免大爆炸合并）

#### C4. 视觉与体验
- [ ] 触摸区 ≥ 44px（移动端适配）
- [ ] 字号比常规大 20%（8 岁孩子友好）
- [ ] 圆角 ≥ 16px（绘本大圆角）
- [ ] 无外链字体、无 CDN 依赖
- [ ] Chrome / Safari / Edge 三浏览器通过
- [ ] iPhone SE 尺寸（375×667）布局不破

---

## 13. 开发命令速查

```bash
# 安装 / 启动
pnpm install
pnpm dev

# 类型 + Lint + 测试
pnpm exec tsc --noEmit
pnpm lint
pnpm vitest run             # 全量
pnpm vitest run --changed   # 仅改动相关

# 构建
pnpm build

# Git
git checkout -b feat/collect-step1
git add .
git commit -m "feat(collect): 实现 step1 标记页"
git push origin feat/collect-step1
```

---

## 14. 启动开发的入口

按 `~/.claude/plans/md-woolly-papert.md` 中的 24 个 PR 切分实施。

---

## 15. Sprint 状态（持久化进度，新会话从这里继续）

**当前进度：17/24 PR（70.8%），17 commits 在 main**

### ✅ 已完成
- **Sprint 0**（PR-0.1 ~ 0.3）：Vite+React+TS+strict / Tailwind 3 绘本风 / Husky+lint-staged+Commitlint+Prettier
- **Sprint 1**（PR-1.1 ~ 1.4）：localStorage+schema / weekKey ISO 8601 / exportImport 合并去重 / Zustand persist stores（card/progress/meta）
- **Sprint 2**（PR-2.1 ~ 2.3）：HashRouter+5 路由 / 4 UI 组件（Button/Chip/Card/Modal）/ 首次启动守卫+12 种子词
- **Sprint 3**（PR-3.1 ~ 3.6）：step1 选词 / step2 说清 / step3 造句 / step4 成段 / 完成弹窗+彩纸 / 顶部进度条+断点续做

### ⏳ 待完成
- **Sprint 4**（PR-4.1 ~ 4.5）：主页布局+CTA / 卡墙+⭐评级 / weekKey 分组 / 单卡详情+删除 / 设置页（导出/导入/清空/关于）
- **Sprint 5**（PR-5.1 ~ 5.4）：引导 3 屏 / 引导接闭环 / 移动端适配 / README

### 关键 bug 修复记录（commit 历史可追溯，新会话避免重蹈）
1. `weekKey` 时区 bug：必须用 `getUTCDate()` 而非 `getDate()`（Asia/Shanghai 时区导致 23:59:59 跨日）
2. `progressStore` 类型：`exactOptionalPropertyTypes: true` 下 literal `null` 不能赋值给 union type，需用 `null as unknown as Progress` 双重断言
3. `storeStorage` 类型：getItem 必须返回**原始 JSON 字符串**（zustand `createJSONStorage` 内部会再 parse），不能直接用 `readStorage`（已 parse 成对象）
4. `storeStorage` 前缀：zustand 传入的 key 已是完整 `w2c.meta`，不要重复加 `w2c.` 前缀
5. `progressStore` 初次 hydration 时序：`HomePage` 需先 await `persist.hasHydrated()` 再判断 `onboardingDone`，否则初次渲染看到 default false 直接跳 /onboarding

### 当前代码关键文件
- `src/shared/lib/storage.ts` — localStorage 封装（`w2c.` 前缀）
- `src/shared/lib/schema.ts` — 8 个类型守卫
- `src/shared/lib/weekKey.ts` — ISO 8601 周键
- `src/shared/lib/exportImport.ts` — 5 字段导出 / 合并去重 / 版本校验
- `src/shared/lib/storeStorage.ts` — Zustand StateStorage 适配
- `src/shared/consts/seeds.ts` — 12 种子词（统编三上第一单元）
- `src/shared/types/index.ts` — 全局 TS 类型
- `src/shared/ui/{Button,Chip,Card,Modal}.tsx` — 通用 UI
- `src/entities/card/model/store.ts` — 闭环卡 store
- `src/entities/progress/model/store.ts` — 断点 store
- `src/entities/meta/model/store.ts` — 元数据 store
- `src/entities/word/model/store.ts` — 种子词 store
- `src/app/router.tsx` — HashRouter + 5 路由 + SplashGuard
- `src/features/select-word|explain-reason|write-sentence|write-paragraph/ui/*.tsx` — 闭环 4 步 feature
- `src/widgets/collect-shell|completion-modal|step-progress/ui/*.tsx` — 闭环 UI 块

### 闭环主流程（已可走通）
`/` 或 `/collect` → 选词 → `/collect/step2` 说清 → `/collect/step3` 造句 → `/collect/step4` 成段 → `/collect/done` 庆祝弹窗 + 入库 Card

---

**本文件优先级**：`CLAUDE.md` > `~/.claude/CLAUDE.md`（个人全局）
**更新规则**：涉及产品原则 / 技术栈 / 工程化约束 / 架构方法的变更，必须先更新本文件再写代码。

**信息源**：
- [React 官方: Thinking in React](https://react.dev/learn/thinking-in-react)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Conventional Commits](https://www.conventionalcommits.org/)