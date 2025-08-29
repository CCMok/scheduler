'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ArrangeRosterState, ArrangeRosterStore, createArrangeRosterStore } from '@/app/(private)/roster/_components/store/arrange-roster-store'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'

export type StoreApi = ReturnType<typeof createArrangeRosterStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<ArrangeRosterState>,
}

export const ArrangeRosterStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createArrangeRosterStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useArrangeRosterStore = <T,>(
  selector: (store: ArrangeRosterStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useArrangeRosterStore must be used within ArrangeRosterStoreProvider`)
  }

  return useStore(storeContext, selector)
}