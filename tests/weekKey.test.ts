import { describe, expect, it } from 'vitest';
import {
  getWeekFromWeekKey,
  getWeekKey,
  getYearFromWeekKey,
  isWeekKeyLE,
} from '@shared/lib/weekKey';

describe('weekKey · getWeekKey', () => {
  it('returns YYYY-Www format with zero-padded week', () => {
    expect(getWeekKey(new Date('2026-01-01T00:00:00Z'))).toBe('2026-W01');
    expect(getWeekKey(new Date('2026-09-08T00:00:00Z'))).toMatch(/^2026-W\d{2}$/);
  });

  it('Monday is the start of the week', () => {
    // 2026-09-07 (周一) 与 2026-09-13 (周日) 应属于同一 ISO 周
    const monday = getWeekKey(new Date('2026-09-07T00:00:00Z'));
    const sunday = getWeekKey(new Date('2026-09-13T23:59:59Z'));
    expect(monday).toBe(sunday);
  });

  describe('cross-year boundaries (ISO 8601)', () => {
    it('2025-12-29 (Mon) belongs to 2026-W01 (Thursday is 2026-01-01)', () => {
      expect(getWeekKey(new Date('2025-12-29T00:00:00Z'))).toBe('2026-W01');
    });

    it('2025-12-28 (Sun) belongs to 2025-W52', () => {
      expect(getWeekKey(new Date('2025-12-28T00:00:00Z'))).toBe('2025-W52');
    });

    it('2026-01-01 (Thu) belongs to 2026-W01', () => {
      expect(getWeekKey(new Date('2026-01-01T00:00:00Z'))).toBe('2026-W01');
    });

    it('2027-01-01 (Fri) belongs to 2026-W53 (Thursday is 2026-12-31)', () => {
      // ISO 规则：周由周四所在年决定。2027-01-01 的周四 = 2026-12-31，所以属于 2026-W53
      // 这说明 2026 是 ISO long year（53 周）
      expect(getWeekKey(new Date('2027-01-01T00:00:00Z'))).toBe('2026-W53');
    });

    it('2027-01-04 (Mon) starts 2027-W01', () => {
      expect(getWeekKey(new Date('2027-01-04T00:00:00Z'))).toBe('2027-W01');
    });

    it('2024-12-30 (Mon) belongs to 2025-W01 (Thursday is 2025-01-02)', () => {
      expect(getWeekKey(new Date('2024-12-30T00:00:00Z'))).toBe('2025-W01');
    });
  });

  describe('year with 53 weeks', () => {
    // ISO 8601 中长年是包含 53 周的年份
    it('handles ISO long years correctly', () => {
      // 2020 是 ISO long year（1月1日是周三，12月31日是周五）
      expect(getWeekKey(new Date('2020-12-31T00:00:00Z'))).toBe('2020-W53');
    });
  });

  describe('UTC stability', () => {
    it('time component does not affect the week', () => {
      const a = getWeekKey(new Date('2026-09-08T01:00:00Z'));
      const b = getWeekKey(new Date('2026-09-08T23:00:00Z'));
      expect(a).toBe(b);
    });
  });

  it('default to current date when no argument', () => {
    const r = getWeekKey();
    expect(r).toMatch(/^\d{4}-W\d{2}$/);
  });
});

describe('weekKey · helpers', () => {
  it('getYearFromWeekKey parses year', () => {
    expect(getYearFromWeekKey('2026-W36')).toBe(2026);
    expect(getYearFromWeekKey('2025-W01')).toBe(2025);
  });

  it('getWeekFromWeekKey parses week', () => {
    expect(getWeekFromWeekKey('2026-W36')).toBe(36);
    expect(getWeekFromWeekKey('2025-W01')).toBe(1);
  });

  it('throws on invalid format', () => {
    expect(() => getYearFromWeekKey('2026-36')).toThrow();
    expect(() => getYearFromWeekKey('2026w36')).toThrow();
    expect(() => getWeekFromWeekKey('2026-W')).toThrow();
  });

  it('isWeekKeyLE compares correctly (lexicographic)', () => {
    expect(isWeekKeyLE('2026-W01', '2026-W02')).toBe(true);
    expect(isWeekKeyLE('2026-W02', '2026-W01')).toBe(false);
    expect(isWeekKeyLE('2026-W36', '2026-W36')).toBe(true);
    expect(isWeekKeyLE('2025-W52', '2026-W01')).toBe(true); // 跨年
  });
});
