import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule'

export type ArrangeRosterState = {
  departmentId?: number,
  workers: Worker[],
  initialSchedules: PostBaseSchedule[],
  modifiedSchedules: PostBaseSchedule[],
  isGenerated: boolean,
}

export type ArrangeRosterActions = {
  setDepartmentId: (departmentId: number) => void,
  setWorkers: (workers: Worker[]) => void,
  setInitialSchedules: (initialSchedules: PostBaseSchedule[]) => void,
  setModifiedSchedules: (modifiedSchedules: PostBaseSchedule[]) => void,
  setIsGenerated: (isGenerated: boolean) => void,
}

export type ArrangeRosterStore = ArrangeRosterState & ArrangeRosterActions

export const defaultInitState: ArrangeRosterState = { 
  workers: [],
  initialSchedules: [],
  modifiedSchedules: [],
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
    setInitialSchedules: initialSchedules => set(() => ({ initialSchedules })),
    setModifiedSchedules: modifiedSchedules => set(() => ({ modifiedSchedules })),
    setIsGenerated: isGenerated => set(() => ({ isGenerated })),
  }))
}