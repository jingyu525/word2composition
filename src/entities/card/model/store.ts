/**
 * Card entity store — src/entities/card/model/store.ts
 * 闭环卡数组 + CRUD
 * persist 到 localStorage key `cards`
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { w2cStateStorage } from '@shared/lib/storeStorage';
import type { Card } from '@shared/types';

type CardState = {
  cards: Card[];
  addCard: (card: Card) => void;
  deleteCard: (id: string) => void;
  clearCards: () => void;
  replaceCards: (newCards: Card[]) => void;
};

export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      cards: [],
      addCard: (card) =>
        set((s) => ({ cards: [...s.cards, card].sort((a, b) => b.createdAt - a.createdAt) })),
      deleteCard: (id) => set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),
      clearCards: () => set({ cards: [] }),
      replaceCards: (newCards) =>
        set({ cards: [...newCards].sort((a, b) => b.createdAt - a.createdAt) }),
    }),
    {
      name: 'w2c.cards',
      storage: createJSONStorage(() => w2cStateStorage),
      partialize: (state) => ({ cards: state.cards }),
    },
  ),
);

/** 便捷选择器 */
export const selectCardCount = (s: CardState): number => s.cards.length;
export const selectThisWeekCards =
  (weekKey: string) =>
  (s: CardState): Card[] =>
    s.cards.filter((c) => c.weekKey === weekKey);
