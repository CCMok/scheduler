'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { CreateRosterState, CreateRosterStore, createCreateRosterStore } from './create-roster-store'

export type StoreApi = ReturnType<typeof createCreateRosterStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<CreateRosterState>,
}

export const CreateRosterStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createCreateRosterStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useCreateRosterStore = <T,>(
  selector: (store: CreateRosterStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useCreateRosterStore must be used within CreateRosterStoreProvider`)
  }

  return useStore(storeContext, selector)
}