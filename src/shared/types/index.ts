/**
 * 全局 TS 类型 — 对应 CLAUDE.md §10
 * 所有实体类型与枚举统一定义，禁止在 slice 内重复声明
 */

/** 6 个理由角度（对应语文考点） */
export type ReasonType = '画面感' | '拟人' | '比喻' | '对比' | '动词精准' | '声音词';

export const REASON_TYPES: readonly ReasonType[] = [
  '画面感',
  '拟人',
  '比喻',
  '对比',
  '动词精准',
  '声音词',
] as const;

/** 闭环步骤（1-4） */
export type StepNumber = 1 | 2 | 3 | 4;

/** 种子词（统编教材三上第一单元） */
export type SeedWord = {
  id: string;
  word: string;
  sceneIcon: string;
  source: string;
  scene: string;
  reason: ReasonType;
  reasonHint: string;
  order: number;
};

/** 闭环卡（终态，只有完成 4 步才生成） */
export type Card = {
  id: string;
  word: string;
  sceneIcon: string;
  source: string;
  reason: ReasonType;
  reasonFill: string;
  reasonExtra?: string;
  sentence: string;
  paragraph: string;
  expandHints: ReasonType[];
  createdAt: number;
  weekKey: string;
};

/** 断点续做（最多 1 份） */
export type Progress = {
  step: StepNumber;
  word?: string;
  sceneIcon?: string;
  source?: string;
  reason?: ReasonType;
  reasonFill?: string;
  reasonExtra?: string;
  sentence?: string;
  expandHints?: ReasonType[];
  updatedAt: number;
};

/** 用户档案 */
export type Profile = {
  nickname: string;
  avatar: 'fox' | 'cat' | 'rabbit' | 'owl';
  createdAt: number;
};

/** 元数据 */
export type Meta = {
  schemaVersion: string;
  firstLaunchAt: number;
  onboardingDone: boolean;
  exportCount: number;
};

/** 导出文件结构 */
export type ExportFile = {
  schemaVersion: string;
  exportedAt: number;
  exportedFrom: string;
  profile?: Profile;
  cards: Card[];
  seeds: SeedWord[];
};
