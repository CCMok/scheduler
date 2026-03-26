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
  VERIFY_EMAIL = '/verify-email',
  VERIFY_EMAIL_SENT = '/verify-email-sent',

  // Function
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
  },
  public: {
    home: '/',
    login: Segment.LOGIN,
    signUp: Segment.SIGN_UP,
    verifyEmailSent: Segment.VERIFY_EMAIL_SENT,
    verifyEmail: (token: string) => `${Segment.VERIFY_EMAIL}/${token}` as Route,
  },
} as const;

export const REDIRECT_PRIVATE_ROUTE = ROUTE.private.roster.base();
export const REDIRECT_PUBLIC_ROUTE = ROUTE.public.login;
export const PUBLIC_ROUTE_EXCLUDE_HOME = [
  ROUTE.public.login,
  ROUTE.public.signUp,
  ROUTE.public.verifyEmailSent,
  ROUTE.public.verifyEmail(''),
] as const;