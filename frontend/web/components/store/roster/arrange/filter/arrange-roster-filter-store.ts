import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { DepartmentWorkers } from '@/libs/server/department/models/department-model'
import { OrganizationDepartmentsWorkers } from '@/libs/server/organization/models/organization-dao'

export type ArrangeRosterFilterState = {
  organizations: OrganizationDepartmentsWorkers[],
  departments: DepartmentWorkers[],
  workers: Worker[],
}

export type ArrangeRosterFilterActions = {
  setOrganizations: (organizations: OrganizationDepartmentsWorkers[]) => void,
  setDepartments: (departments: DepartmentWorkers[]) => void,
  setWorkers: (workers: Worker[]) => void,
}

export type ArrangeRosterFilterStore = ArrangeRosterFilterState & ArrangeRosterFilterActions

export const defaultInitState: ArrangeRosterFilterState = {
  organizations: [],
  departments: [],
  workers: [],
}

export const createArrangeRosterFilterStore = (
  partialInitState?: Partial<ArrangeRosterFilterState>,
) => {
  return createStore<ArrangeRosterFilterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setOrganizations: organizations => set(() => ({ organizations })),
    setDepartments: departments => set(() => ({ departments })),
    setWorkers: workers => set(() => ({ workers })),
  }))
}