import { afterEach, beforeEach, describe, expect, it } from 'vitest';

/**
 * Store 测试：用 inline mock localStorage（vitest 2 jsdom 集成不稳）
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

beforeEach(() => {
  const mock = createStorageMock();
  // @ts-expect-error
  globalThis.localStorage = mock;
});

afterEach(() => {
  // @ts-expect-error
  delete globalThis.localStorage;
});

// import 必须在 mock 之后
import { useCardStore } from '@entities/card/model/store';
import { useMetaStore } from '@entities/meta/model/store';
import { useProgressStore } from '@entities/progress/model/store';
import type { Card, Progress } from '@shared/types';

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
  createdAt: 1700100000000,
};

const sampleProgress: Progress = {
  step: 2,
  word: '凌乱',
  reason: '画面感',
  updatedAt: 1700000000000,
};

describe('cardStore', () => {
  beforeEach(() => {
    useCardStore.setState({ cards: [] });
  });

  it('starts with empty cards', () => {
    expect(useCardStore.getState().cards).toEqual([]);
  });

  it('addCard appends and sorts by createdAt desc', () => {
    useCardStore.getState().addCard(card1);
    useCardStore.getState().addCard(card2);
    const cards = useCardStore.getState().cards;
    expect(cards).toHaveLength(2);
    expect(cards[0]?.id).toBe('card-002');
    expect(cards[1]?.id).toBe('card-001');
  });

  it('deleteCard removes by id', () => {
    useCardStore.getState().addCard(card1);
    useCardStore.getState().addCard(card2);
    useCardStore.getState().deleteCard('card-001');
    expect(useCardStore.getState().cards).toHaveLength(1);
    expect(useCardStore.getState().cards[0]?.id).toBe('card-002');
  });

  it('clearCards empties the array', () => {
    useCardStore.getState().addCard(card1);
    useCardStore.getState().clearCards();
    expect(useCardStore.getState().cards).toEqual([]);
  });

  it('replaceCards replaces all', () => {
    useCardStore.getState().addCard(card1);
    useCardStore.getState().replaceCards([card2]);
    expect(useCardStore.getState().cards).toHaveLength(1);
    expect(useCardStore.getState().cards[0]?.id).toBe('card-002');
  });
});

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.setState({ progress: null });
  });

  it('starts with null', () => {
    expect(useProgressStore.getState().progress).toBeNull();
  });

  it('setProgress stores progress', () => {
    useProgressStore.getState().setProgress(sampleProgress);
    expect(useProgressStore.getState().progress).toEqual(sampleProgress);
  });

  it('clearProgress resets to null', () => {
    useProgressStore.getState().setProgress(sampleProgress);
    useProgressStore.getState().clearProgress();
    expect(useProgressStore.getState().progress).toBeNull();
  });
});

describe('metaStore', () => {
  beforeEach(() => {
    useMetaStore.setState({
      meta: {
        schemaVersion: '1.0',
        firstLaunchAt: 0,
        onboardingDone: false,
        exportCount: 0,
      },
    });
  });

  it('starts with default meta', () => {
    const m = useMetaStore.getState().meta;
    expect(m.schemaVersion).toBe('1.0');
    expect(m.firstLaunchAt).toBe(0);
    expect(m.onboardingDone).toBe(false);
    expect(m.exportCount).toBe(0);
  });

  it('markOnboardingDone flips to true', () => {
    useMetaStore.getState().markOnboardingDone();
    expect(useMetaStore.getState().meta.onboardingDone).toBe(true);
  });

  it('incrementExportCount bumps count', () => {
    useMetaStore.getState().incrementExportCount();
    expect(useMetaStore.getState().meta.exportCount).toBe(1);
    useMetaStore.getState().incrementExportCount();
    expect(useMetaStore.getState().meta.exportCount).toBe(2);
  });
});
