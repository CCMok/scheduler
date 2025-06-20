import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule'

export type ArrangeRosterState = {
  departmentId?: number,
  workers: Worker[],
  postBaseSchedules: PostBaseSchedule[],
  isGenerated: boolean,
}

export type ArrangeRosterActions = {
  setDepartmentId: (departmentId: number) => void,
  setWorkers: (workers: Worker[]) => void,
  setPostBaseSchedules: (postBaseSchedules: PostBaseSchedule[]) => void,
  setIsGenerated: (isGenerated: boolean) => void,
}

export type ArrangeRosterStore = ArrangeRosterState & ArrangeRosterActions

export const defaultInitState: ArrangeRosterState = { 
  workers: [],
  postBaseSchedules: [],
  isGenerated: false,
}

export const createArrangeRosterStore = (
  partialInitState?: Partial<ArrangeRosterState>,
) => {
  return createStore<ArrangeRosterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setDepartmentId: departmentId => set(() => ({ departmentId })),
    setWorkers: workers => set(() => ({ workers })),
    setPostBaseSchedules: postBaseSchedules => set(() => ({ postBaseSchedules })),
    setIsGenerated: isGenerated => set(() => ({ isGenerated })),
  }))
}