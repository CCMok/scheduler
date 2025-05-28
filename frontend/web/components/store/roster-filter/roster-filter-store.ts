import { OrganizationDepartments } from '@/libs/server/organization/models/organization-models'
import { createStore } from 'zustand/vanilla'

export type RosterFilterState = {
  organizations: OrganizationDepartments[]
}

export type RosterFilterActions = {
  setOrganizations: (organizations: OrganizationDepartments[]) => void,
}

export type RosterFilterStore = RosterFilterState & RosterFilterActions

export const defaultInitState: RosterFilterState = {
  organizations: [],
}

export const createRosterFilterStore = (
  initState: RosterFilterState = defaultInitState,
) => {
  return createStore<RosterFilterStore>()(set => ({
    ...initState,
    setOrganizations: organizations => set(() => ({ organizations })),
  }))
}