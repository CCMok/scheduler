export const searchParamKey = {
  TEAM_ID: 'teamId',
  ROSTER_ID: 'rosterId',
} as const

export type SearchParam = {
  [searchParamKey.TEAM_ID]?: string;
  /** numeric id or `new` for unsaved create workspace */
  [searchParamKey.ROSTER_ID]?: string;
}