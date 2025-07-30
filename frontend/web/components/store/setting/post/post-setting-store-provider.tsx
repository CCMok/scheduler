'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { createPostSettingStore, PostSettingState, PostSettingStore } from './post-setting-store'

export type StoreApi = ReturnType<typeof createPostSettingStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<PostSettingState>,
}

export const PostSettingStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createPostSettingStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const usePostSettingStore = <T,>(
  selector: (store: PostSettingStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`usePostSettingStore must be used within PostSettingStoreProvider`)
  }

  return useStore(storeContext, selector)
}