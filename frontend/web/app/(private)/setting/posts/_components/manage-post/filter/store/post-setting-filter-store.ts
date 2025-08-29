import { createStore } from 'zustand/vanilla'
import { OrganizationDepartments } from '@/libs/server/organization/models/organization-dao'
import { Department } from '@/external/prisma-generated'

export type PostSettingFilterState = {
  organizations: OrganizationDepartments[],
  departments: Department[],
}

export type PostSettingFilterActions = {
  setOrganizations: (organizations: OrganizationDepartments[]) => void,
  setDepartments: (departments: Department[]) => void,
}

export type PostSettingFilterStore = PostSettingFilterState & PostSettingFilterActions

export const defaultInitState: PostSettingFilterState = {
  organizations: [],
  departments: [],
}

export const createPostSettingFilterStore = (
  partialInitState?: Partial<PostSettingFilterState>,
) => {
  return createStore<PostSettingFilterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setOrganizations: organizations => set(() => ({ organizations })),
    setDepartments: departments => set(() => ({ departments })),
  }))
}