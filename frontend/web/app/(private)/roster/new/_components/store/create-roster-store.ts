import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule'
import { LocalStorageKey } from '@/libs/client/_general/enums/local-storage-key'
import { OffFormInput } from '../filter/form/create-roster-form-input'

export type CreateRosterState = {
  generatedScheduleDepartmentId?: number,
  generatedScheduleWorkers: Worker[],
  generatedScheduleOffs: OffFormInput[],
  initialSchedules: PostBaseSchedule[],
  modifiedSchedules: PostBaseSchedule[],
  isGenerated: boolean,
  saveState: boolean,
}

export type CreateRosterActions = {
  setGeneratedScheduleDepartmentId: (generatedScheduleDepartmentId: number) => void,
  setGeneratedScheduleWorkers: (generatedScheduleWorkers: Worker[]) => void,
  setGeneratedScheduleOffs: (generatedScheduleOffs: OffFormInput[]) => void,
  setInitialSchedules: (initialSchedules: PostBaseSchedule[]) => void,
  setModifiedSchedules: (modifiedSchedules: PostBaseSchedule[]) => void,
  setIsGenerated: (isGenerated: boolean) => void,
  reset: () => void,
}

export type CreateRosterStore = CreateRosterState & CreateRosterActions

export const defaultInitState: CreateRosterState = {
  generatedScheduleWorkers: [],
  generatedScheduleOffs: [],
  initialSchedules: [],
  modifiedSchedules: [],
  isGenerated: false,
  saveState: false,
}

export const createCreateRosterStore = (
  partialInitState?: Partial<CreateRosterState>,
) => {
  return createStore<CreateRosterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setGeneratedScheduleDepartmentId: generatedScheduleDepartmentId => set(state => {
      if (state.saveState) {
        localStorage.setItem(LocalStorageKey.CREATE_ROSTER_GENERATED_DEPARTMENT_ID, generatedScheduleDepartmentId.toString())
      }
      return { generatedScheduleDepartmentId }
    }),
    setGeneratedScheduleWorkers: generatedScheduleWorkers => set(() => ({ generatedScheduleWorkers })),
    setGeneratedScheduleOffs: generatedScheduleOffs => set(state => {
      if (state.saveState) {
        localStorage.setItem(LocalStorageKey.CREATE_ROSTER_GENERATED_OFFS, JSON.stringify(generatedScheduleOffs))
      }
      return { generatedScheduleOffs }
    }),
    setInitialSchedules: initialSchedules => set(state => {
      if (state.saveState) {
        localStorage.setItem(LocalStorageKey.CREATE_ROSTER_INITIAL_SCHEDULES, JSON.stringify(initialSchedules))
      }
      return { initialSchedules }
    }),
    setModifiedSchedules: modifiedSchedules => set(state => {
      if (state.saveState) {
        localStorage.setItem(LocalStorageKey.CREATE_ROSTER_MODIFIED_SCHEDULES, JSON.stringify(modifiedSchedules))
      }
      return { modifiedSchedules }
    }),
    setIsGenerated: isGenerated => set(() => ({ isGenerated })),
    reset: () => set(state => {
      if (state.saveState) {
        localStorage.removeItem(LocalStorageKey.CREATE_ROSTER_GENERATED_DEPARTMENT_ID)
        localStorage.removeItem(LocalStorageKey.CREATE_ROSTER_GENERATED_OFFS)
        localStorage.removeItem(LocalStorageKey.CREATE_ROSTER_INITIAL_SCHEDULES)
        localStorage.removeItem(LocalStorageKey.CREATE_ROSTER_MODIFIED_SCHEDULES)
      }
      return defaultInitState
    })
  }))
}