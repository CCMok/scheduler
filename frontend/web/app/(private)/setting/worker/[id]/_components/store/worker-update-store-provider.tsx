'use client'

import { createContext, useRef, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { createWorkerUpdateStore, WorkerUpdateState } from './worker-update-store'

export type StoreApi = ReturnType<typeof createWorkerUpdateStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<WorkerUpdateState>,
}

export const WorkerUpdateStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  // Initialize store only once
  storeRef.current ??= createWorkerUpdateStore(initState);

  // Update store state when initState changes (e.g., on page refresh)
  useEffect(() => {
    if (storeRef.current && initState) {
      storeRef.current.setState(initState)
    }
  }, [initState])

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const useWorkerUpdateStore = <T,>(
  selector: (store: WorkerUpdateState) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`useWorkerUpdateStore must be used within WorkerUpdateStoreProvider`)
  }

  return useStore(storeContext, selector)
}