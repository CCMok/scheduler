import { createStore } from 'zustand/vanilla'
import { Schedule } from '@/libs/server/roster/model/roster'
import { Worker } from '@/external/prisma-generated'
import { DepartmentWorkers } from '@/libs/server/department/models/department-model'
import { OrganizationDepartmentsWorkers } from '@/libs/server/organization/models/organization-model'

export type RosterState = {
  organizations: OrganizationDepartmentsWorkers[],
  departments: DepartmentWorkers[],
  workers: Worker[],
  schedules: Schedule[],
  isGenerated: boolean,
}

export type RosterActions = {
  setOrganizations: (organizations: OrganizationDepartmentsWorkers[]) => void,
  setDepartments: (departments: DepartmentWorkers[]) => void,
  setWorkers: (workers: Worker[]) => void,
  setSchedules: (scehdules: Schedule[]) => void,
  setIsGenerated: (isGenerated: boolean) => void,
}

export type RosterStore = RosterState & RosterActions

export const defaultInitState: RosterState = {
  organizations: [],
  departments: [],
  workers: [],
  schedules: [],
  isGenerated: false,
}

export const createRosterStore = (
  partialInitState?: Partial<RosterState>,
) => {
  return createStore<RosterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setOrganizations: organizations => set(() => ({ organizations })),
    setDepartments: departments => set(() => ({ departments })),
    setWorkers: workers => set(() => ({ workers })),
    setSchedules: schedules => set(() => ({ schedules })),
    setIsGenerated: isGenerated => set(() => ({ isGenerated })),
  }))
}