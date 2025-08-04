import { createStore } from 'zustand/vanilla'
import { Post } from '@/external/prisma-generated'

export type PostSettingState = {
  posts: Post[],
  postNameFilter: string,
}

export type PostSettingActions = {
  setPosts: (posts: Post[]) => void,
  setPostNameFilter: (postNameFilter: string) => void,
}

export type PostSettingStore = PostSettingState & PostSettingActions

export const defaultInitState: PostSettingState = { 
  posts: [],
  postNameFilter: '',
}

export const createPostSettingStore = (
  partialInitState?: Partial<PostSettingState>,
) => {
  return createStore<PostSettingStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setPosts: posts => set(() => ({ posts })),
    setPostNameFilter: postNameFilter => set(() => ({ postNameFilter })),
  }))
}