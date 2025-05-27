import { OrganizationDepartments } from '@/libs/server/organization/models/organization-models'
import { createStore } from 'zustand/vanilla'

export type RosterFilterState = {
  organizationDepartments: OrganizationDepartments[]
}

export type RosterFilterActions = {
  setOrganizationDepartments: (organizationDepartments: OrganizationDepartments[]) => void,
}

export type RosterFilterStore = RosterFilterState & RosterFilterActions

export const defaultInitState: RosterFilterState = {
  organizationDepartments: [],
}

export const createRosterFilterStore = (
  initState: RosterFilterState = defaultInitState,
) => {
  return createStore<RosterFilterStore>()(set => ({
    ...initState,
    setOrganizationDepartments: organizationDepartments => set(() => ({ organizationDepartments })),
  }))
}