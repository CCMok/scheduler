export const SearchParamKey = {
  TEAM_ID: 'teamId',
  ROSTER_ID: 'rosterId',
}

export type SearchParam = {
  [SearchParamKey.TEAM_ID]?: string; 
  [SearchParamKey.ROSTER_ID]?: string;
}