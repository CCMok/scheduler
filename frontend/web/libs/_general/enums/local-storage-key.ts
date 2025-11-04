export enum LocalStorageKey {
  CREATE_ROSTER_FILTER_FORM = 'create-roster-filter-form',
  CREATE_ROSTER_INITIAL_SCHEDULES = 'create-initial-schedules',
  CREATE_ROSTER_MODIFIED_SCHEDULES = 'create-roster-modified-schedules',
  CREATE_ROSTER_GENERATED_DEPARTMENT_ID = 'create-roster-generated-department-id',
  CREATE_ROSTER_GENERATED_OFFS = 'create-roster-generated-offs',
}

export const CLEANABLE_LOCAL_STORAGE_KEYS = [
  LocalStorageKey.CREATE_ROSTER_FILTER_FORM,
  LocalStorageKey.CREATE_ROSTER_INITIAL_SCHEDULES,
  LocalStorageKey.CREATE_ROSTER_MODIFIED_SCHEDULES,
  LocalStorageKey.CREATE_ROSTER_GENERATED_DEPARTMENT_ID,
  LocalStorageKey.CREATE_ROSTER_GENERATED_OFFS,
]