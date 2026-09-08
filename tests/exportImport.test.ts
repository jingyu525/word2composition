import { describe, expect, it } from 'vitest';
import {
  buildExportFile,
  buildExportFilename,
  mergeCards,
  mergeSeeds,
  parseImportFile,
  replaceCards,
} from '@shared/lib/exportImport';
import type { Card, ExportFile, SeedWord } from '@shared/types';

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

const card1: Card = {
  id: 'card-001',
  word: '凌乱',
  sceneIcon: '🍂',
  source: '《铺满金色巴掌的水泥道》',
  reason: '画面感',
  reasonFill: '秋风吹落叶',
  sentence: '秋天来了，树叶凌乱地落下来。',
  paragraph: '秋天来了，树叶凌乱地落下来，铺满整条水泥道。',
  expandHints: ['画面感'],
  createdAt: 1700000000000,
  weekKey: '2026-W36',
};

const card2: Card = {
  ...card1,
  id: 'card-002',
  word: '潮湿',
  sceneIcon: '🌧️',
  createdAt: 1700100000000,
};

const card3: Card = {
  ...card1,
  id: 'card-003',
  word: '熨帖',
  sceneIcon: '👕',
  createdAt: 1699900000000,
};

describe('exportImport · buildExportFile', () => {
  it('includes all 5 required fields', () => {
    const f = buildExportFile({ cards: [card1], seeds: [validSeed] });
    expect(f.schemaVersion).toBe('1.0');
    expect(typeof f.exportedAt).toBe('number');
    expect(typeof f.exportedFrom).toBe('string');
    expect(Array.isArray(f.cards)).toBe(true);
    expect(Array.isArray(f.seeds)).toBe(true);
  });

  it('profile is optional', () => {
    const f = buildExportFile({ cards: [], seeds: [] });
    expect(f.profile).toBeUndefined();
  });

  it('profile included when provided', () => {
    const profile = { nickname: '小朋友', avatar: 'fox' as const, createdAt: Date.now() };
    const f = buildExportFile({ profile, cards: [], seeds: [] });
    expect(f.profile).toEqual(profile);
  });
});

describe('exportImport · parseImportFile', () => {
  const validJSON = JSON.stringify({
    schemaVersion: '1.0',
    exportedAt: 1700000000000,
    exportedFrom: 'test',
    cards: [card1],
    seeds: [validSeed],
  });

  it('parses a valid file', () => {
    const r = parseImportFile(validJSON);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.cards).toHaveLength(1);
      expect(r.data.seeds).toHaveLength(1);
      expect(r.data.schemaVersion).toBe('1.0');
    }
  });

  it('rejects malformed JSON', () => {
    const r = parseImportFile('{not json}');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/JSON/);
  });

  it('rejects non-object root', () => {
    expect(parseImportFile('"string"').ok).toBe(false);
    expect(parseImportFile('null').ok).toBe(false);
    expect(parseImportFile('42').ok).toBe(false);
  });

  it('rejects when schemaVersion mismatches', () => {
    const bad = JSON.stringify({ ...JSON.parse(validJSON), schemaVersion: '0.5' });
    const r = parseImportFile(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/版本/);
  });

  it('rejects when schemaVersion missing', () => {
    const obj = JSON.parse(validJSON) as Record<string, unknown>;
    delete obj.schemaVersion;
    const r = parseImportFile(JSON.stringify(obj));
    expect(r.ok).toBe(false);
  });

  it('rejects when cards is invalid', () => {
    const obj = JSON.parse(validJSON) as Record<string, unknown>;
    obj.cards = [{ invalid: true }];
    const r = parseImportFile(JSON.stringify(obj));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/cards/);
  });

  it('rejects when seeds is invalid', () => {
    const obj = JSON.parse(validJSON) as Record<string, unknown>;
    obj.seeds = [{ invalid: true }];
    const r = parseImportFile(JSON.stringify(obj));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/seeds/);
  });

  it('rejects when profile has wrong type', () => {
    const obj = JSON.parse(validJSON) as Record<string, unknown>;
    obj.profile = { nickname: 123, createdAt: 'x', avatar: 'fox' };
    const r = parseImportFile(JSON.stringify(obj));
    expect(r.ok).toBe(false);
  });

  it('accepts empty cards and seeds arrays', () => {
    const obj = JSON.parse(validJSON) as Record<string, unknown>;
    obj.cards = [];
    obj.seeds = [];
    const r = parseImportFile(JSON.stringify(obj));
    expect(r.ok).toBe(true);
  });
});

describe('exportImport · mergeCards', () => {
  it('combines without duplicates', () => {
    const r = mergeCards([card1, card2], [card2, card3]);
    expect(r).toHaveLength(3);
    expect(r.map((c) => c.id).sort()).toEqual(['card-001', 'card-002', 'card-003']);
  });

  it('imported wins on id conflict', () => {
    const updated = { ...card1, paragraph: '新内容' };
    const r = mergeCards([card1], [updated]);
    expect(r).toHaveLength(1);
    expect(r[0]?.paragraph).toBe('新内容');
  });

  it('returns sorted by createdAt descending', () => {
    const r = mergeCards([card1, card3], [card2]);
    expect(r.map((c) => c.id)).toEqual(['card-002', 'card-001', 'card-003']);
  });

  it('handles empty arrays', () => {
    expect(mergeCards([], [])).toEqual([]);
    expect(mergeCards([card1], [])).toEqual([card1]);
    expect(mergeCards([], [card1])).toEqual([card1]);
  });

  it('does not mutate inputs', () => {
    const existing = [card1];
    const imported = [card2];
    mergeCards(existing, imported);
    expect(existing).toHaveLength(1);
    expect(imported).toHaveLength(1);
  });
});

describe('exportImport · replaceCards', () => {
  it('discards existing', () => {
    const r = replaceCards([card1, card2], [card3]);
    expect(r).toHaveLength(1);
    expect(r[0]?.id).toBe('card-003');
  });

  it('returns imported sorted by createdAt descending', () => {
    const r = replaceCards([], [card1, card3, card2]);
    expect(r.map((c) => c.id)).toEqual(['card-002', 'card-001', 'card-003']);
  });
});

describe('exportImport · mergeSeeds', () => {
  const seedA: SeedWord = { ...validSeed, word: '凌乱', order: 1 };
  const seedB: SeedWord = { ...validSeed, word: '潮湿', order: 2 };

  it('combines without duplicates by word', () => {
    const r = mergeSeeds([seedA], [seedB]);
    expect(r).toHaveLength(2);
  });

  it('imported wins on word conflict', () => {
    const updated = { ...seedA, sceneIcon: '🍁' };
    const r = mergeSeeds([seedA], [updated]);
    expect(r[0]?.sceneIcon).toBe('🍁');
  });

  it('returns sorted by order ascending', () => {
    const r = mergeSeeds([seedB], [seedA]);
    expect(r.map((s) => s.word)).toEqual(['凌乱', '潮湿']);
  });
});

describe('exportImport · buildExportFilename', () => {
  it('uses YYYY-MM-DD format', () => {
    expect(buildExportFilename(new Date('2026-09-08T00:00:00Z'))).toBe(
      'w2c-export-2026-09-08.json',
    );
  });

  it('zero-pads single-digit months and days', () => {
    expect(buildExportFilename(new Date(2026, 0, 5))).toBe('w2c-export-2026-01-05.json');
  });
});
