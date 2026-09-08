import { describe, expect, it } from 'vitest';
import {
  isCard,
  isCardArray,
  isProgress,
  isReasonType,
  isSeedWord,
  isSeedWordArray,
  isStepNumber,
} from '@shared/lib/schema';
import type { Card, Progress, SeedWord } from '@shared/types';

const validSeed: SeedWord = {
  id: 'seed-01',
  word: '凌乱',
  sceneIcon: '🍂',
  source: '《铺满金色巴掌的水泥道》',
  scene: '环境·秋天',
  reason: '画面感',
  reasonHint: '让我想到秋风吹落叶的画面',
  order: 1,
};

const validCard: Card = {
  id: 'card-001',
  word: '凌乱',
  sceneIcon: '🍂',
  source: '《铺满金色巴掌的水泥道》',
  reason: '画面感',
  reasonFill: '秋风吹落叶',
  sentence: '秋天来了，树叶凌乱地落下来。',
  paragraph: '秋天来了，树叶凌乱地落下来，铺满整条水泥道。',
  expandHints: ['画面感', '声音词'],
  createdAt: 1700000000000,
  weekKey: '2026-W36',
};

const validProgress: Progress = {
  step: 2,
  word: '凌乱',
  sceneIcon: '🍂',
  source: '《铺满金色巴掌的水泥道》',
  reason: '画面感',
  reasonFill: '秋风吹落叶',
  updatedAt: 1700000000000,
};

describe('schema · isReasonType', () => {
  it('accepts the 6 reasons', () => {
    expect(isReasonType('画面感')).toBe(true);
    expect(isReasonType('拟人')).toBe(true);
    expect(isReasonType('比喻')).toBe(true);
    expect(isReasonType('对比')).toBe(true);
    expect(isReasonType('动词精准')).toBe(true);
    expect(isReasonType('声音词')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isReasonType('画面')).toBe(false);
    expect(isReasonType('')).toBe(false);
    expect(isReasonType(123)).toBe(false);
    expect(isReasonType(null)).toBe(false);
    expect(isReasonType(undefined)).toBe(false);
    expect(isReasonType({})).toBe(false);
  });
});

describe('schema · isStepNumber', () => {
  it('accepts 1-4', () => {
    expect(isStepNumber(1)).toBe(true);
    expect(isStepNumber(2)).toBe(true);
    expect(isStepNumber(3)).toBe(true);
    expect(isStepNumber(4)).toBe(true);
  });

  it('rejects 0, 5, and non-numbers', () => {
    expect(isStepNumber(0)).toBe(false);
    expect(isStepNumber(5)).toBe(false);
    expect(isStepNumber('1')).toBe(false);
    expect(isStepNumber(null)).toBe(false);
  });
});

describe('schema · isSeedWord', () => {
  it('accepts a valid SeedWord', () => {
    expect(isSeedWord(validSeed)).toBe(true);
  });

  it('rejects when reason is invalid', () => {
    expect(isSeedWord({ ...validSeed, reason: '画面' })).toBe(false);
  });

  it('rejects when types are wrong', () => {
    expect(isSeedWord({ ...validSeed, word: 123 })).toBe(false);
    expect(isSeedWord({ ...validSeed, order: '1' })).toBe(false);
  });

  it('rejects null and primitives', () => {
    expect(isSeedWord(null)).toBe(false);
    expect(isSeedWord(undefined)).toBe(false);
    expect(isSeedWord('凌乱')).toBe(false);
    expect(isSeedWord(42)).toBe(false);
  });

  it('rejects empty object', () => {
    expect(isSeedWord({})).toBe(false);
  });
});

describe('schema · isCard', () => {
  it('accepts a valid Card', () => {
    expect(isCard(validCard)).toBe(true);
  });

  it('accepts a Card with reasonExtra', () => {
    expect(isCard({ ...validCard, reasonExtra: '还有很多' })).toBe(true);
  });

  it('rejects when reasonExtra has wrong type', () => {
    expect(isCard({ ...validCard, reasonExtra: 123 })).toBe(false);
  });

  it('rejects when expandHints contains invalid reason', () => {
    expect(isCard({ ...validCard, expandHints: ['画面感', 'unknown'] })).toBe(false);
  });

  it('rejects when weekKey is missing', () => {
    const { weekKey: _, ...rest } = validCard;
    expect(isCard(rest)).toBe(false);
  });

  it('rejects when sentence or paragraph missing', () => {
    expect(isCard({ ...validCard, sentence: '' })).toBe(false);
    expect(isCard({ ...validCard, paragraph: '' })).toBe(false);
  });
});

describe('schema · isCardArray / isSeedWordArray', () => {
  it('accepts empty array', () => {
    expect(isCardArray([])).toBe(true);
    expect(isSeedWordArray([])).toBe(true);
  });

  it('accepts array of valid items', () => {
    expect(isCardArray([validCard])).toBe(true);
    expect(isSeedWordArray([validSeed])).toBe(true);
  });

  it('rejects if any item is invalid', () => {
    expect(isCardArray([validCard, { invalid: true }])).toBe(false);
  });

  it('rejects non-array', () => {
    expect(isCardArray(validCard)).toBe(false);
    expect(isCardArray(null)).toBe(false);
  });
});

describe('schema · isProgress', () => {
  it('accepts null', () => {
    expect(isProgress(null)).toBe(true);
  });

  it('accepts valid Progress', () => {
    expect(isProgress(validProgress)).toBe(true);
  });

  it('accepts Progress with all optional fields undefined', () => {
    expect(isProgress({ step: 1, updatedAt: 1700000000000 })).toBe(true);
  });

  it('rejects invalid step', () => {
    expect(isProgress({ ...validProgress, step: 5 })).toBe(false);
    expect(isProgress({ ...validProgress, step: '1' })).toBe(false);
  });

  it('rejects when updatedAt is missing', () => {
    const { updatedAt: _, ...rest } = validProgress;
    expect(isProgress(rest)).toBe(false);
  });

  it('rejects invalid reason', () => {
    expect(isProgress({ ...validProgress, reason: 'unknown' })).toBe(false);
  });

  it('rejects invalid expandHints', () => {
    expect(isProgress({ ...validProgress, expandHints: ['画面感', 'xxx'] })).toBe(false);
  });

  it('rejects primitives', () => {
    expect(isProgress(42)).toBe(false);
    expect(isProgress('progress')).toBe(false);
  });
});
