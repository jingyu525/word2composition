/**
 * 导出/导入逻辑 — src/shared/lib/exportImport.ts
 * 实现 CLAUDE.md §A8 验收：5 字段导出、合并去重、替换、版本校验
 */

import { isCard, isCardArray, isSeedWord, isSeedWordArray } from '@shared/lib/schema';
import { SCHEMA_VERSION } from '@shared/lib/storage';
import type { Card, ExportFile, Profile, SeedWord } from '@shared/types';

/** 构建标准导出文件结构 */
export function buildExportFile(opts: {
  profile?: Profile | undefined;
  cards: Card[];
  seeds: SeedWord[];
}): ExportFile {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: Date.now(),
    exportedFrom: '新鲜感词语库 MVP',
    ...(opts.profile ? { profile: opts.profile } : {}),
    cards: opts.cards,
    seeds: opts.seeds,
  };
}

/**
 * 解析导入文件（JSON 文本），返回校验结果
 * - ok=false 时 error 是用户可读的中文提示
 */
export function parseImportFile(
  text: string,
): { ok: true; data: ExportFile } | { ok: false; error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: '文件不是合法 JSON' };
  }

  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: '文件结构错误：根对象缺失' };
  }

  const o = raw as Record<string, unknown>;

  if (o.schemaVersion !== SCHEMA_VERSION) {
    return {
      ok: false,
      error: `版本不兼容：期望 ${SCHEMA_VERSION}，实际 ${String(o.schemaVersion ?? '缺失')}`,
    };
  }

  if (typeof o.exportedAt !== 'number') {
    return { ok: false, error: '文件结构错误：exportedAt 缺失或类型错误' };
  }

  if (typeof o.exportedFrom !== 'string') {
    return { ok: false, error: '文件结构错误：exportedFrom 缺失或类型错误' };
  }

  if (!isCardArray(o.cards)) {
    return { ok: false, error: '文件结构错误：cards 不是合法闭环卡数组' };
  }

  if (!isSeedWordArray(o.seeds)) {
    return { ok: false, error: '文件结构错误：seeds 不是合法种子词数组' };
  }

  // profile 可选
  if (o.profile !== undefined) {
    const p = o.profile as Record<string, unknown>;
    if (
      typeof p !== 'object' ||
      typeof p.nickname !== 'string' ||
      typeof p.createdAt !== 'number' ||
      typeof p.avatar !== 'string'
    ) {
      return { ok: false, error: '文件结构错误：profile 字段不合法' };
    }
  }

  // 用 isCard / isSeedWord 校验过的结果，TypeScript 类型断言安全
  return {
    ok: true,
    data: {
      schemaVersion: o.schemaVersion as string,
      exportedAt: o.exportedAt,
      exportedFrom: o.exportedFrom,
      ...(o.profile ? { profile: o.profile as Profile } : {}),
      cards: o.cards as Card[],
      seeds: o.seeds as SeedWord[],
    },
  };
}

/**
 * 合并：按 id 去重，imported 优先（同 id 用 imported 覆盖）
 * 返回结果按 createdAt 倒序
 */
export function mergeCards(existing: Card[], imported: Card[]): Card[] {
  const map = new Map<string, Card>();
  for (const c of existing) map.set(c.id, c);
  for (const c of imported) map.set(c.id, c); // imported 覆盖 existing 同 id
  return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
}

/** 替换：丢弃 existing，全部用 imported */
export function replaceCards(_existing: Card[], imported: Card[]): Card[] {
  return [...imported].sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * 合并种子词：按 word 字段去重（种子词可能 id 不同但 word 相同，如不同版本）
 * imported 优先
 */
export function mergeSeeds(existing: SeedWord[], imported: SeedWord[]): SeedWord[] {
  const map = new Map<string, SeedWord>();
  for (const s of existing) map.set(s.word, s);
  for (const s of imported) map.set(s.word, s);
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

/** 生成下载文件名：`w2c-export-YYYY-MM-DD.json` */
export function buildExportFilename(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `w2c-export-${y}-${m}-${d}.json`;
}

/**
 * 触发浏览器下载（依赖 DOM，仅在浏览器环境调用）
 * 测试用 inline mock 实现 URL.createObjectURL / document.createElement
 */
export function downloadAsJSON(data: ExportFile, filename?: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? buildExportFilename();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** 验证 Card（用于过滤已损坏数据） */
export function isValidCard(v: unknown): v is Card {
  return isCard(v);
}

/** 验证 SeedWord */
export function isValidSeedWord(v: unknown): v is SeedWord {
  return isSeedWord(v);
}
