import { createStore } from 'zustand/vanilla'
import { Worker } from '@/external/prisma-generated'
import { DepartmentWorkers } from '@/libs/server/department/models/department-model'
import { OrganizationDepartmentsWorkers } from '@/libs/server/organization/models/organization-model'
import { PostBaseSchedule } from '@/libs/share/roster/models/post-base-schedule'

export type RosterState = {
  organizations: OrganizationDepartmentsWorkers[],
  departments: DepartmentWorkers[],
  workers: Worker[],
  postBaseSchedules: PostBaseSchedule[],
  isGenerated: boolean,
}

export type RosterActions = {
  setOrganizations: (organizations: OrganizationDepartmentsWorkers[]) => void,
  setDepartments: (departments: DepartmentWorkers[]) => void,
  setWorkers: (workers: Worker[]) => void,
  setPostBaseSchedules: (postBaseSchedules: PostBaseSchedule[]) => void,
  setIsGenerated: (isGenerated: boolean) => void,
}

export type RosterStore = RosterState & RosterActions

export const defaultInitState: RosterState = {
  organizations: [],
  departments: [],
  workers: [],
  postBaseSchedules: [],
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
    setPostBaseSchedules: postBaseSchedules => set(() => ({ postBaseSchedules })),
    setIsGenerated: isGenerated => set(() => ({ isGenerated })),
  }))
}