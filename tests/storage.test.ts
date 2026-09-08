import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Storage 测试使用 inline mock，避免依赖 jsdom/happy-dom 集成差异
 * mock 严格匹配 W3C Web Storage API
 */

type StorageMock = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  readonly length: number;
};

function createStorageMock(): StorageMock {
  const map = new Map<string, string>();
  return {
    getItem: (k) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
    clear: () => {
      map.clear();
    },
    key: (i) => Array.from(map.keys())[i] ?? null,
    get length() {
      return map.size;
    },
  };
}

let mock: StorageMock;

beforeEach(() => {
  mock = createStorageMock();
  // @ts-expect-error — 测试环境覆盖全局 localStorage
  globalThis.localStorage = mock;
});

afterEach(() => {
  // @ts-expect-error
  delete globalThis.localStorage;
});

// 注意：import 必须在 setup 之后，否则 storage.ts 模块顶层就拿到 undefined
import {
  SCHEMA_VERSION,
  checkSchemaVersion,
  clearAllStorage,
  readStorage,
  removeStorage,
  setSchemaVersion,
  writeStorage,
} from '@shared/lib/storage';

describe('storage', () => {
  describe('read/write basic', () => {
    it('writes and reads a primitive value', () => {
      writeStorage('foo', 42);
      expect(readStorage<number>('foo')).toBe(42);
    });

    it('writes and reads an object', () => {
      const obj = { a: 1, b: 'hi', c: [true, false] };
      writeStorage('bar', obj);
      expect(readStorage<typeof obj>('bar')).toEqual(obj);
    });

    it('returns null when key does not exist', () => {
      expect(readStorage<unknown>('nope')).toBeNull();
    });

    it('prefixes all keys with "w2c."', () => {
      writeStorage('myKey', 'x');
      expect(mock.getItem('w2c.myKey')).not.toBeNull();
      expect(mock.getItem('myKey')).toBeNull();
    });
  });

  describe('error handling', () => {
    it('returns null when stored JSON is malformed', () => {
      mock.setItem('w2c.broken', '{not json}');
      expect(readStorage<unknown>('broken')).toBeNull();
    });

    it('console.errors on malformed JSON', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mock.setItem('w2c.broken', '{not json}');
      readStorage('broken');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('remove + clear', () => {
    it('removes a single key', () => {
      writeStorage('a', 1);
      removeStorage('a');
      expect(readStorage('a')).toBeNull();
    });

    it('clears only w2c.* keys, leaving others untouched', () => {
      writeStorage('a', 1);
      mock.setItem('other.app.key', 'leave me');
      clearAllStorage();
      expect(readStorage('a')).toBeNull();
      expect(mock.getItem('other.app.key')).toBe('leave me');
    });
  });

  describe('schemaVersion', () => {
    it('returns ok=false when not set', () => {
      const r = checkSchemaVersion();
      expect(r.ok).toBe(false);
      expect(r.version).toBeNull();
    });

    it('returns ok=false when version mismatch', () => {
      mock.setItem('w2c.schemaVersion', '"0.5"');
      const r = checkSchemaVersion();
      expect(r.ok).toBe(false);
      expect(r.version).toBe('0.5');
    });

    it('returns ok=true after setSchemaVersion', () => {
      setSchemaVersion();
      expect(checkSchemaVersion().ok).toBe(true);
      expect(checkSchemaVersion().version).toBe(SCHEMA_VERSION);
    });

    it('exposes SCHEMA_VERSION constant', () => {
      expect(SCHEMA_VERSION).toBe('1.0');
    });
  });
});
