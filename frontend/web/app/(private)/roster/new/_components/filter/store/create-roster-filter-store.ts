import { createStore } from 'zustand/vanilla'
import { Department, Organization, Worker } from '@/external/prisma-generated'

export type CreateRosterFilterState = {
  organizations: Organization[],
  departments: Department[],
  workers: Worker[],
}

export type CreateRosterFilterActions = {
  setOrganizations: (organizations: Organization[]) => void,
  setDepartments: (departments: Department[]) => void,
  setWorkers: (workers: Worker[]) => void,
}

export type CreateRosterFilterStore = CreateRosterFilterState & CreateRosterFilterActions

export const defaultInitState: CreateRosterFilterState = {
  organizations: [],
  departments: [],
  workers: [],
}

export const createCreateRosterFilterStore = (
  partialInitState?: Partial<CreateRosterFilterState>,
) =>
  createStore<CreateRosterFilterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setOrganizations: organizations => set(() => ({ organizations })),
    setDepartments: departments => set(() => ({ departments })),
    setWorkers: workers => set(() => ({ workers })),
  }))
