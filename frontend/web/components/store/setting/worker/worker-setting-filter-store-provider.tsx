'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { createWorkerSettingFilterStore, WorkerSettingFilterState, WorkerSettingFilterStore } from './worker-setting-filter-store'

export type StoreApi = ReturnType<typeof createWorkerSettingFilterStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<WorkerSettingFilterState>,
}

export const WorkerSettingFilterStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createWorkerSettingFilterStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useWorkerSettingFilterStore = <T,>(
  selector: (store: WorkerSettingFilterStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useWorkerSettingFilterStore must be used within WorkerSettingFilterStoreProvider`)
  }

  return useStore(storeContext, selector)
}