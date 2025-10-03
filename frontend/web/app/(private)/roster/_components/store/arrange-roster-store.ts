import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule'
import { LocalStorageKey } from '@/libs/client/_general/enums/local-storage-key'

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
    setGeneratedScheduleDepartmentId: generatedScheduleDepartmentId => set(() => {
      localStorage.setItem(LocalStorageKey.ARRANGE_ROSTER_GENERATED_DEPARTMENT_ID, generatedScheduleDepartmentId.toString())
      return { generatedScheduleDepartmentId }
    }),
    setGeneratedScheduleWorkers: generatedScheduleWorkers => set(() => ({ generatedScheduleWorkers })),
    setInitialSchedules: initialSchedules => set(() => {
      localStorage.setItem(LocalStorageKey.ARRANGE_ROSTER_INITIAL_SCHEDULES, JSON.stringify(initialSchedules))
      return { initialSchedules }
    }),
    setModifiedSchedules: modifiedSchedules => set(() => {
      localStorage.setItem(LocalStorageKey.ARRANGE_ROSTER_MODIFIED_SCHEDULES, JSON.stringify(modifiedSchedules))
      return { modifiedSchedules }
    }),
    setIsGenerated: isGenerated => set(() => ({ isGenerated })),
  }))
}