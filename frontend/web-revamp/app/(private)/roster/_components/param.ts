import { Path } from "@/libs/_general/path/path";
import { isNil } from "lodash";

export const SearchParamKey = {
  TEAM_ID: 'teamId',
  ROSTER_ID: 'rosterId',
}

export type SearchParam = {
  [SearchParamKey.TEAM_ID]?: string; 
  [SearchParamKey.ROSTER_ID]?: string;
}

export const buildRosterUrl = (teamId?: number, rosterId?: number): string => {
  const params = new URLSearchParams();
  if (!isNil(teamId)) params.set(SearchParamKey.TEAM_ID, String(teamId));
  if (!isNil(rosterId)) params.set(SearchParamKey.ROSTER_ID, String(rosterId));
  const q = params.toString();
  return q ? `${Path.ROSTER}?${q}` : Path.ROSTER;
}