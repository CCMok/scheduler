import { createStore } from 'zustand/vanilla';

export type MaxHistoryCountState = {
  maxHistoryCount?: number;
  isFetchingMaxHistoryCount: boolean;
};

export type MaxHistoryCountActions = {
  setMaxHistoryCount: (maxHistoryCount?: number) => void;
  setIsFetchingMaxHistoryCount: (isFetchingMaxHistoryCount: boolean) => void;
};

export type MaxHistoryCountStore = MaxHistoryCountState & MaxHistoryCountActions;

export const defaultInitState: MaxHistoryCountState = {
  maxHistoryCount: undefined,
  isFetchingMaxHistoryCount: false,
};

export const createMaxHistoryCountStore = (
  partialInitState?: Partial<MaxHistoryCountState>,
) => {
  return createStore<MaxHistoryCountStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setMaxHistoryCount: maxHistoryCount => set({ maxHistoryCount }),
    setIsFetchingMaxHistoryCount: isFetchingMaxHistoryCount => set({ isFetchingMaxHistoryCount }),
  }));
}; 