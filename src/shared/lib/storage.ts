/**
 * localStorage 封装 — src/shared/lib/storage.ts
 * 所有 key 加 `w2c.` 前缀，避免与未来扩展冲突
 *
 * 纯函数 + 类型守卫，不依赖 React / DOM（除 globalThis.localStorage）
 */

const STORAGE_PREFIX = 'w2c.';
export const SCHEMA_VERSION = '1.0';

export class SchemaMismatchError extends Error {
  constructor(actualVersion: string | null) {
    super(`Schema version mismatch: expected ${SCHEMA_VERSION}, got ${actualVersion ?? 'null'}`);
    this.name = 'SchemaMismatchError';
  }
}

export class StorageParseError extends Error {
  constructor(key: string, cause: unknown) {
    super(`[storage] Failed to parse "${key}": ${String(cause)}`);
    this.name = 'StorageParseError';
  }
}

function fullKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/** 读取 localStorage，失败返回 null（不抛错给上层） */
export function readStorage<T>(key: string): T | null {
  const raw = localStorage.getItem(fullKey(key));
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[storage] Failed to parse "${key}":`, err);
    return null;
  }
}

/** 写入 localStorage，失败抛错（让上层感知） */
export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(fullKey(key), JSON.stringify(value));
  } catch (err) {
    console.error(`[storage] Failed to write "${key}":`, err);
    throw err;
  }
}

export function removeStorage(key: string): void {
  localStorage.removeItem(fullKey(key));
}

export function clearAllStorage(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}

/** 检查 schemaVersion；返回 ok + 实际版本 */
export function checkSchemaVersion(): { ok: boolean; version: string | null } {
  const v = readStorage<string>('schemaVersion');
  return { ok: v === SCHEMA_VERSION, version: v };
}

export function setSchemaVersion(): void {
  writeStorage('schemaVersion', SCHEMA_VERSION);
}

/** 测试辅助：清空所有 w2c.* key（仅用于 vitest） */
export function __resetStorageForTests(): void {
  clearAllStorage();
}
