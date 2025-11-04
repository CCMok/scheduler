import { createStore } from 'zustand/vanilla'
import { Post } from '@/external/prisma-generated'

export type PostSequenceState = {
  posts: Post[],
}

export type PostSequenceActions = {
  setPosts: (posts: Post[]) => void,
}

export type PostSequenceStore = PostSequenceState & PostSequenceActions

export const defaultInitState: PostSequenceState = {
  posts: [],
}

export const createPostSequenceStore = (
  partialInitState?: Partial<PostSequenceState>,
) => {
  return createStore<PostSequenceStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setPosts: posts => set(() => ({ posts })),
  }))
}