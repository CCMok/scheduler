'use client'

import { createContext, useRef, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { createPostUpdateStore, PostUpdateState, PostUpdateStore } from './post-update-store'

export type StoreApi = ReturnType<typeof createPostUpdateStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<PostUpdateState>,
}

export const PostUpdateStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  // Initialize store only once
  if (!storeRef.current) {
    storeRef.current = createPostUpdateStore(initState)
  }

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

export const usePostUpdateStore = <T,>(
  selector: (store: PostUpdateStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`usePostUpdateStore must be used within PostUpdateStoreProvider`)
  }

  return useStore(storeContext, selector)
}