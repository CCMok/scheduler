import { createStore } from 'zustand/vanilla'
import { Post } from '@/external/prisma-generated'

export type WorkerUpdateState = {
  workerId: number,
  workerName: string,
  posts: Post[],
  departmentId: number,
}

export const defaultInitState: WorkerUpdateState = { 
  workerId: 0,
  workerName: '',
  posts: [],
  departmentId: 0,
}

export const createWorkerUpdateStore = (
  partialInitState?: Partial<WorkerUpdateState>,
) => {
  return createStore<WorkerUpdateState>()(() => ({
    ...defaultInitState,
    ...partialInitState,
  }))
}