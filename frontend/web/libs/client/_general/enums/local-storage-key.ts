export enum LocalStorageKey {
  ARRANGE_ROSTER_FORM = 'arrange-roster-form',
  ARRANGE_ROSTER_INITIAL_SCHEDULES = 'arrange-roster-initial-schedules',
  ARRANGE_ROSTER_MODIFIED_SCHEDULES = 'arrange-roster-modified-schedules',
  ARRANGE_ROSTER_GENERATED_DEPARTMENT_ID = 'arrange-roster-generated-department-id',
  ARRANGE_ROSTER_GENERATED_OFFS = 'arrange-roster-generated-offs',
}

export const CLEANABLE_LOCAL_STORAGE_KEYS = [
  LocalStorageKey.ARRANGE_ROSTER_FORM,
  LocalStorageKey.ARRANGE_ROSTER_INITIAL_SCHEDULES,
  LocalStorageKey.ARRANGE_ROSTER_MODIFIED_SCHEDULES,
  LocalStorageKey.ARRANGE_ROSTER_GENERATED_DEPARTMENT_ID,
  LocalStorageKey.ARRANGE_ROSTER_GENERATED_OFFS,
]