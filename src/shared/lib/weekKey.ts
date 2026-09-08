/**
 * ISO 周计算 — src/shared/lib/weekKey.ts
 * 标准 ISO 8601：周一为周开始，周日为周结束
 * 格式：`YYYY-Www`（如 "2026-W36"），用于按周聚合卡片
 *
 * 参考算法：https://en.wikipedia.org/wiki/ISO_week_date
 */

/**
 * 计算给定日期的 ISO 周键
 * @param date - 默认当前时间
 * @returns 形如 "2026-W36"
 */
export function getWeekKey(date: Date = new Date()): string {
  // 用 UTC 方法读取年月日，避免本地时区干扰（关键 bug 修复点）
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * 比较两个 weekKey：A 是否早于 B（或相同）
 */
export function isWeekKeyLE(a: string, b: string): boolean {
  return a <= b;
}

/**
 * 从 weekKey 解析年份
 */
export function getYearFromWeekKey(weekKey: string): number {
  const m = /^(\d{4})-W(\d{2})$/.exec(weekKey);
  if (!m) throw new Error(`Invalid weekKey: ${weekKey}`);
  return Number(m[1]);
}

/**
 * 从 weekKey 解析周数（1-53）
 */
export function getWeekFromWeekKey(weekKey: string): number {
  const m = /^(\d{4})-W(\d{2})$/.exec(weekKey);
  if (!m) throw new Error(`Invalid weekKey: ${weekKey}`);
  return Number(m[2]);
}
