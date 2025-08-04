const enum PathSegment {
  LOGIN = 'login',
  REGISTER = 'register',
  DASHBOARD = 'dashboard',
  ROSTER = 'roster',
  SETTING = 'setting',
  USER = 'user',
  ORGANIZATION = 'organization',
  DEPARTMENT = 'department',
  POST = 'post',
}

export const PATH = {
  home: '/',
  login: `/${PathSegment.LOGIN}`,
  register: `/${PathSegment.REGISTER}`,
  dashboard: `/${PathSegment.DASHBOARD}`,
  roster: `/${PathSegment.ROSTER}`,

  setting: {
    base: `/${PathSegment.SETTING}`,
    user: `/${PathSegment.SETTING}/${PathSegment.USER}`,
    organization: `/${PathSegment.SETTING}/${PathSegment.ORGANIZATION}`,
    department: {
      base: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}`,
      post: {
        build: (departmentId?: string) => {
          const base = `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.POST}`;
          return departmentId ? `${base}?departmentId=${departmentId}` : base
        }
      },
    }
  }
} as const

export const REDIRECT_PUBLIC_PATH = PATH.login;
export const REDIRECT_PRIVATE_PATH = PATH.dashboard;

export const EXCLUDE_HOME_PUBLIC_PATHS = [PATH.login, PATH.register];