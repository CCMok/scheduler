import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'

export type PostUpdateState = {
  postId: number,
  postName: string,
  workers: Worker[],
  departmentId: number,
}

export const defaultInitState: PostUpdateState = { 
  postId: 0,
  postName: '',
  workers: [],
  departmentId: 0,
}

export const createPostUpdateStore = (
  partialInitState?: Partial<PostUpdateState>,
) => {
  return createStore<PostUpdateState>()(() => ({
    ...defaultInitState,
    ...partialInitState,
  }))
}