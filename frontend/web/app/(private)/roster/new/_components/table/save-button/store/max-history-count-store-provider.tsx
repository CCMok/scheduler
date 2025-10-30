'use client';

import { createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type MaxHistoryCountStore, createMaxHistoryCountStore, MaxHistoryCountState } from './max-history-count-store';
import { ChildrenProps } from '@/libs/share/_general/props/children-props';

export type StoreApi = ReturnType<typeof createMaxHistoryCountStore>

export const MaxHistoryCountStoreContext = createContext<StoreApi | undefined>(undefined);

export type Props = ChildrenProps & {
    initState?: Partial<MaxHistoryCountState>,
}

export const MaxHistoryCountStoreProvider = ({ children, initState }: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null);
  
  storeRef.current ??= createMaxHistoryCountStore(initState);

  return (
    <MaxHistoryCountStoreContext.Provider value={storeRef.current}>
      {children}
    </MaxHistoryCountStoreContext.Provider>
  );
};

export const useMaxHistoryCountStore = <T,>(selector: (store: MaxHistoryCountStore) => T,): T => {
  const maxHistoryCountStoreContext = useContext(MaxHistoryCountStoreContext);

  if (!maxHistoryCountStoreContext) {
    throw new Error(`useMaxHistoryCountStore must be use within MaxHistoryCountStoreProvider`);
  }

  return useStore(maxHistoryCountStoreContext, selector);
}; 