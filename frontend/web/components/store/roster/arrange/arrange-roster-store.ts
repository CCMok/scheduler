import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule'

export type ArrangeRosterState = {
  departmentId?: number,
  workers: Worker[],
  initialSchedules: PostBaseSchedule[],
  isGenerated: boolean,
  modifiedSchedules: PostBaseSchedule[],
}

export type ArrangeRosterActions = {
  setDepartmentId: (departmentId: number) => void,
  setWorkers: (workers: Worker[]) => void,
  setInitialSchedules: (initialSchedules: PostBaseSchedule[]) => void,
  setIsGenerated: (isGenerated: boolean) => void,
  setModifiedSchedules: (modifiedSchedules: PostBaseSchedule[]) => void,
}

export type ArrangeRosterStore = ArrangeRosterState & ArrangeRosterActions

export const defaultInitState: ArrangeRosterState = { 
  workers: [],
  initialSchedules: [],
  isGenerated: false,
  modifiedSchedules: [],
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
    setIsGenerated: isGenerated => set(() => ({ isGenerated })),
    setModifiedSchedules: modifiedSchedules => set(() => ({ modifiedSchedules })),
  }))
}