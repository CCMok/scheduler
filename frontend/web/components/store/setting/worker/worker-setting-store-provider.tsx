'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { createWorkerSettingStore, WorkerSettingState, WorkerSettingStore } from './worker-setting-store'

export type StoreApi = ReturnType<typeof createWorkerSettingStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<WorkerSettingState>,
}

export const WorkerSettingStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createWorkerSettingStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useWorkerSettingStore = <T,>(
  selector: (store: WorkerSettingStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useWorkerSettingStore must be used within WorkerSettingStoreProvider`)
  }

  return useStore(storeContext, selector)
}