'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ArrangeRosterFilterState, ArrangeRosterFilterStore, createArrangeRosterFilterStore } from '@/app/(private)/roster/_components/filter/store/arrange-roster-filter-store'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'

export type StoreApi = ReturnType<typeof createArrangeRosterFilterStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<ArrangeRosterFilterState>,
}

export const ArrangeRosterFilterStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createArrangeRosterFilterStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useArrangeRosterFilterStore = <T,>(
  selector: (store: ArrangeRosterFilterStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useArrangeRosterFilterStore must be used within ArrangeRosterFilterStoreProvider`)
  }

  return useStore(storeContext, selector)
}