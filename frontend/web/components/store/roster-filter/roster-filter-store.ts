import { OrganizationDepartmentsWorkers } from '@/libs/server/organization/models/organization-model'
import { DepartmentWorkers } from '@/libs/server/department/models/department-model'
import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'

export type RosterFilterState = {
  organizations: OrganizationDepartmentsWorkers[],
  departments: DepartmentWorkers[],
  workers: Worker[],
}

export type RosterFilterActions = {
  setOrganizations: (organizations: OrganizationDepartmentsWorkers[]) => void,
  setDepartments: (departments: DepartmentWorkers[]) => void,
  setWorkers: (workers: Worker[]) => void,
}

export type RosterFilterStore = RosterFilterState & RosterFilterActions

export const defaultInitState: RosterFilterState = {
  organizations: [],
  departments: [],
  workers: [],
}

export const createRosterFilterStore = (
  partialInitState?: Partial<RosterFilterState>,
) => {
  return createStore<RosterFilterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setOrganizations: organizations => set(() => ({ organizations })),
    setDepartments: departments => set(() => ({ departments })),
    setWorkers: workers => set(() => ({ workers })),
  }))
}