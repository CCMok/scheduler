'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { RosterState, RosterStore, createRosterStore } from '@/components/store/roster/roster-store'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'

export type RosterStoreApi = ReturnType<typeof createRosterStore>

export const StoreContext = createContext<RosterStoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<RosterState>,
}

export const RosterStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<RosterStoreApi | null>(null)

  storeRef.current ??= createRosterStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useRosterStore = <T,>(
  selector: (store: RosterStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useRosterStore must be used within RosterStoreProvider`)
  }

  return useStore(storeContext, selector)
}