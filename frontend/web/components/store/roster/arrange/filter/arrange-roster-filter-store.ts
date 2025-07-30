import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { DepartmentWorkers } from '@/libs/server/department/models/department-model'
import { OrganizationDepartmentsWorkers } from '@/libs/server/organization/models/organization-dao'
import { OffDay } from '@/libs/client/roster/models/off-day'

export type ArrangeRosterFilterState = {
  organizations: OrganizationDepartmentsWorkers[],
  departments: DepartmentWorkers[],
  workers: Worker[],
  offDays: OffDay[],
}

export type ArrangeRosterFilterActions = {
  setOrganizations: (organizations: OrganizationDepartmentsWorkers[]) => void,
  setDepartments: (departments: DepartmentWorkers[]) => void,
  setWorkers: (workers: Worker[]) => void,
  setOffDays: (offDays: OffDay[]) => void,
}

export type ArrangeRosterFilterStore = ArrangeRosterFilterState & ArrangeRosterFilterActions

export const defaultInitState: ArrangeRosterFilterState = {
  organizations: [],
  departments: [],
  workers: [],
  offDays: [],
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
    setOffDays: offDays => set(() => ({ offDays })),
  }))
}