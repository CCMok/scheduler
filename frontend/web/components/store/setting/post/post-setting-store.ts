import { createStore } from 'zustand/vanilla'
import { Post, Worker } from '@/external/prisma-generated'
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule'

export type PostSettingState = {
  posts: Post[],
}

export type PostSettingActions = {
  setPosts: (posts: Post[]) => void,
}

export type PostSettingStore = PostSettingState & PostSettingActions

export const defaultInitState: PostSettingState = { 
  posts: [],
}

export const createPostSettingStore = (
  partialInitState?: Partial<PostSettingState>,
) => {
  return createStore<PostSettingStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setPosts: posts => set(() => ({ posts })),
  }))
}