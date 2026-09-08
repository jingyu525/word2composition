/**
 * Schema 校验 — src/shared/lib/schema.ts
 * 手写类型守卫（无外部依赖），用于 localStorage / 导入 JSON 的运行时校验
 */

import {
  REASON_TYPES,
  type Card,
  type Progress,
  type ReasonType,
  type SeedWord,
  type StepNumber,
} from '@shared/types';

export function isReasonType(v: unknown): v is ReasonType {
  return typeof v === 'string' && (REASON_TYPES as readonly string[]).includes(v);
}

export function isStepNumber(v: unknown): v is StepNumber {
  return v === 1 || v === 2 || v === 3 || v === 4;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0;
}

export function isSeedWord(v: unknown): v is SeedWord {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    isNonEmptyString(o.id) &&
    isNonEmptyString(o.word) &&
    isNonEmptyString(o.sceneIcon) &&
    isNonEmptyString(o.source) &&
    isNonEmptyString(o.scene) &&
    isReasonType(o.reason) &&
    isNonEmptyString(o.reasonHint) &&
    typeof o.order === 'number'
  );
}

export function isCard(v: unknown): v is Card {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    isNonEmptyString(o.id) &&
    isNonEmptyString(o.word) &&
    isNonEmptyString(o.sceneIcon) &&
    isNonEmptyString(o.source) &&
    isReasonType(o.reason) &&
    isNonEmptyString(o.reasonFill) &&
    (o.reasonExtra === undefined || typeof o.reasonExtra === 'string') &&
    isNonEmptyString(o.sentence) &&
    isNonEmptyString(o.paragraph) &&
    Array.isArray(o.expandHints) &&
    o.expandHints.every(isReasonType) &&
    typeof o.createdAt === 'number' &&
    isNonEmptyString(o.weekKey)
  );
}

export function isCardArray(v: unknown): v is Card[] {
  return Array.isArray(v) && v.every(isCard);
}

export function isSeedWordArray(v: unknown): v is SeedWord[] {
  return Array.isArray(v) && v.every(isSeedWord);
}

/**
 * Progress 是断点（可空），校验较宽松：只检查关键字段
 */
export function isProgress(v: unknown): v is Progress {
  if (v === null) return true;
  if (typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  if (!isStepNumber(o.step)) return false;
  if (typeof o.updatedAt !== 'number') return false;
  // 可选字段
  if (o.word !== undefined && typeof o.word !== 'string') return false;
  if (o.sceneIcon !== undefined && typeof o.sceneIcon !== 'string') return false;
  if (o.source !== undefined && typeof o.source !== 'string') return false;
  if (o.reason !== undefined && !isReasonType(o.reason)) return false;
  if (o.reasonFill !== undefined && typeof o.reasonFill !== 'string') return false;
  if (o.reasonExtra !== undefined && typeof o.reasonExtra !== 'string') return false;
  if (o.sentence !== undefined && typeof o.sentence !== 'string') return false;
  if (o.expandHints !== undefined) {
    if (!Array.isArray(o.expandHints) || !o.expandHints.every(isReasonType)) return false;
  }
  return true;
}
