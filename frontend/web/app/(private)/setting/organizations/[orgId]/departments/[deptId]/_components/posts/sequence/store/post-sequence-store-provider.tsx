'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { createPostSequenceStore, PostSequenceState, PostSequenceStore } from './post-sequence-store'

export type StoreApi = ReturnType<typeof createPostSequenceStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<PostSequenceState>,
}

export const PostSequenceStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createPostSequenceStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const usePostSequenceStore = <T,>(
  selector: (store: PostSequenceStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`usePostSequenceStore must be used within PostSequenceStoreProvider`)
  }

  return useStore(storeContext, selector)
}