import { createStore } from 'zustand/vanilla'
import { OrganizationDepartments } from '@/libs/server/organization/models/organization-dao'
import { Department } from '@/external/prisma-generated'

export type WorkerSettingFilterState = {
  organizations: OrganizationDepartments[],
  departments: Department[],
}

export type WorkerSettingFilterActions = {
  setOrganizations: (organizations: OrganizationDepartments[]) => void,
  setDepartments: (departments: Department[]) => void,
}

export type WorkerSettingFilterStore = WorkerSettingFilterState & WorkerSettingFilterActions

export const defaultInitState: WorkerSettingFilterState = {
  organizations: [],
  departments: [],
}

export const createWorkerSettingFilterStore = (
  partialInitState?: Partial<WorkerSettingFilterState>,
) => {
  return createStore<WorkerSettingFilterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setOrganizations: organizations => set(() => ({ organizations })),
    setDepartments: departments => set(() => ({ departments })),
  }))
}