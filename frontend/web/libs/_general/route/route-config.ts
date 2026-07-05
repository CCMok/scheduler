import { Route } from "next";

type SearchParam = Record<string, string | number | boolean | undefined>;

const buildSearchParam = (
  route: string,
  searchParam?: SearchParam,
): string => {
  if (!searchParam) return route;

  const params = new URLSearchParams();
  Object.entries(searchParam).forEach(([key, value]) => {
    if (!value) return;
    params.append(key, String(value))
  })

  const query = params.toString();
  return query ? `${route}?${query}` : route;
}

enum Segment {
  ROSTER = '/roster',
  LOGIN = '/login',
  SIGN_UP = '/sign-up',
  RESET_PASSWORD = '/reset-password',
  VERIFICATION = '/verification',
  SENT = '/sent',
  SETTING = '/setting',
  USER = '/user',
  TEAM = '/team',

  // Function
  NEW = '/new',
  AUTO_NEW = '/auto-new',
  EDIT = '/edit',
}

export const ROUTE = {
  private: {
    roster: {
      base: (searchParam?: SearchParam) => buildSearchParam(Segment.ROSTER, searchParam) as Route,
      autoNew: (teamId: string | number) => `${Segment.ROSTER}${Segment.AUTO_NEW}/${teamId}` as Route,
      edit: (rosterId: string | number) => `${Segment.ROSTER}${Segment.EDIT}/${rosterId}` as Route,
    },
    setting: {
      team: {
        base: (searchParam?: SearchParam) => buildSearchParam(`${Segment.SETTING}${Segment.TEAM}`, searchParam) as Route,
        new: `${Segment.SETTING}${Segment.TEAM}${Segment.NEW}`,
      },
      user: `${Segment.SETTING}${Segment.USER}`,
    },
  },
  public: {
    home: '/',
    login: Segment.LOGIN,
    resetPassword: {
      base: Segment.RESET_PASSWORD,
      verification: {
        sent: `${Segment.RESET_PASSWORD}${Segment.VERIFICATION}${Segment.SENT}`,
        token: (token: string) => `${Segment.RESET_PASSWORD}${Segment.VERIFICATION}/${token}` as Route,
      },
    },
    signUp: {
      base: Segment.SIGN_UP,
      verification: {
        sent: `${Segment.SIGN_UP}${Segment.VERIFICATION}${Segment.SENT}`,
        token: (token: string) => `${Segment.SIGN_UP}${Segment.VERIFICATION}/${token}` as Route,
      },
    },
  },
} as const;

export const REDIRECT_PRIVATE_ROUTE = ROUTE.private.roster.base();
export const REDIRECT_PUBLIC_ROUTE = ROUTE.public.login;
export const PUBLIC_ROUTE_EXCLUDE_HOME = [
  Segment.LOGIN,
  Segment.RESET_PASSWORD,
  Segment.SIGN_UP,
] as const;