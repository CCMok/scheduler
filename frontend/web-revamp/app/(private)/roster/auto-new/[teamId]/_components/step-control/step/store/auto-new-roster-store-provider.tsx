'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { AutoNewRosterStore, createAutoNewRosterStore } from "./auto-new-roster-store";
import { useStore } from "zustand";

export type AutoNewRosterStoreApi = ReturnType<typeof createAutoNewRosterStore>

export const AutoNewRosterStoreContext = createContext<AutoNewRosterStoreApi | undefined>(undefined)

export const AutoNewRosterStoreProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [store] = useState(() => createAutoNewRosterStore())
  return (
    <AutoNewRosterStoreContext.Provider value={store}>
      {children}
    </AutoNewRosterStoreContext.Provider>
  )
}

export const useAutoNewRosterStore = <T,>(
  selector: (store: AutoNewRosterStore) => T,
): T => {
  const storeContext = useContext(AutoNewRosterStoreContext)
  if (!storeContext) {
    throw new Error('useAutoNewRosterStore must be used within AutoNewRosterStoreProvider')
  }
  return useStore(storeContext, selector)
}