'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { createCreateRosterFilterStore, CreateRosterFilterState, CreateRosterFilterStore } from './create-roster-filter-store'

export type StoreApi = ReturnType<typeof createCreateRosterFilterStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<CreateRosterFilterState>,
}

export const CreateRosterFilterStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createCreateRosterFilterStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useCreateRosterFilterStore = <T,>(
  selector: (store: CreateRosterFilterStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useCreateRosterFilterStore must be used within CreateRosterFilterStoreProvider`)
  }

  return useStore(storeContext, selector)
}