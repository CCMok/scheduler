import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule'

export type ArrangeRosterState = {
  generatedScheduleDepartmentId?: number,
  generatedScheduleWorkers: Worker[],
  initialSchedules: PostBaseSchedule[],
  modifiedSchedules: PostBaseSchedule[],
  isGenerated: boolean,
}

export type ArrangeRosterActions = {
  setGeneratedScheduleDepartmentId: (generatedScheduleDepartmentId: number) => void,
  setGeneratedScheduleWorkers: (generatedScheduleWorkers: Worker[]) => void,
  setInitialSchedules: (initialSchedules: PostBaseSchedule[]) => void,
  setModifiedSchedules: (modifiedSchedules: PostBaseSchedule[]) => void,
  setIsGenerated: (isGenerated: boolean) => void,
}

export type ArrangeRosterStore = ArrangeRosterState & ArrangeRosterActions

export const defaultInitState: ArrangeRosterState = { 
  generatedScheduleWorkers: [],
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
    setGeneratedScheduleDepartmentId: generatedScheduleDepartmentId => set(() => ({ generatedScheduleDepartmentId })),
    setGeneratedScheduleWorkers: generatedScheduleWorkers => set(() => ({ generatedScheduleWorkers })),
    setInitialSchedules: initialSchedules => set(() => ({ initialSchedules })),
    setModifiedSchedules: modifiedSchedules => set(() => ({ modifiedSchedules })),
    setIsGenerated: isGenerated => set(() => ({ isGenerated })),
  }))
}