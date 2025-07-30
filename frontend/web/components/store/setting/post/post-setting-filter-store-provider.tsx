'use client'

import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { ChildrenProps } from '@/libs/share/_general/props/children-props'
import { createPostSettingFilterStore, PostSettingFilterState, PostSettingFilterStore } from './post-setting-filter-store'

export type StoreApi = ReturnType<typeof createPostSettingFilterStore>

export const StoreContext = createContext<StoreApi | undefined>(
  undefined,
)

export type Props = ChildrenProps & {
  initState?: Partial<PostSettingFilterState>,
}

export const PostSettingFilterStoreProvider = ({
  children,
  initState,
}: Readonly<Props>) => {
  const storeRef = useRef<StoreApi | null>(null)

  storeRef.current ??= createPostSettingFilterStore(initState);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

export const usePostSettingFilterStore = <T,>(
  selector: (store: PostSettingFilterStore) => T,
): T => {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    throw new Error(`usePostSettingFilterStore must be used within PostSettingFilterStoreProvider`)
  }

  return useStore(storeContext, selector)
}