import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'

export type WorkerSettingState = {
  workers: Worker[],
  workerNameFilter: string,
  departmentId?: number,
}

export type WorkerSettingActions = {
  setWorkers: (workers: Worker[]) => void,
  setWorkerNameFilter: (workerNameFilter: string) => void,
  setDepartmentId: (departmentId: number) => void,
}

export type WorkerSettingStore = WorkerSettingState & WorkerSettingActions

export const defaultInitState: WorkerSettingState = { 
  workers: [],
  workerNameFilter: '',
}

export const createWorkerSettingStore = (
  partialInitState?: Partial<WorkerSettingState>,
) => {
  return createStore<WorkerSettingStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setWorkers: workers => set(() => ({ workers })),
    setWorkerNameFilter: workerNameFilter => set(() => ({ workerNameFilter })),
    setDepartmentId: departmentId => set(() => ({ departmentId })),
  }))
}