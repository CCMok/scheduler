'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { RosterFilterState, RosterFilterStore, createRosterFilterStore } from '@/components/store/roster-filter/roster-filter-store'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'

export type RosterFilterStoreApi = ReturnType<typeof createRosterFilterStore>

export const StoreContext = createContext<RosterFilterStoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<RosterFilterState>,
}

export const RosterFilterStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<RosterFilterStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createRosterFilterStore(initState)
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useRosterFilterStore = <T,>(
  selector: (store: RosterFilterStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useRosterFilterStore must be used within RosterFilterStoreProvider`)
  }

  return useStore(storeContext, selector)
}