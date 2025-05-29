import { OrganizationDepartmentsWorkers } from '@/libs/server/organization/models/organization-model'
import { DepartmentWorkers } from '@/libs/server/department/models/department-model'
import { createStore } from 'zustand/vanilla'

export type RosterFilterState = {
  organizations: OrganizationDepartmentsWorkers[],
  departments: DepartmentWorkers[],
}

export type RosterFilterActions = {
  setOrganizations: (organizations: OrganizationDepartmentsWorkers[]) => void,
  setDepartments: (departments: DepartmentWorkers[]) => void,
}

export type RosterFilterStore = RosterFilterState & RosterFilterActions

export const defaultInitState: RosterFilterState = {
  organizations: [],
  departments: [],
}

export const createRosterFilterStore = (
  initState: RosterFilterState = defaultInitState,
) => {
  return createStore<RosterFilterStore>()(set => ({
    ...initState,
    setOrganizations: organizations => set(() => ({ organizations })),
    setDepartments: departments => set(() => ({ departments })),
  }))
}