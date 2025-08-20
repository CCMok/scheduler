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
  WORKER = 'worker',
  SEQUENCE = 'sequence',
}

const enum PathSegmentAction {
  UPDATE = 'update',
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
        base: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.POST}`,
        update: {
          base: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.POST}/${PathSegmentAction.UPDATE}`,
          build: (id: number) => `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.POST}/${PathSegmentAction.UPDATE}/${id}`,
        },
        sequence: {
          base: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.POST}/${PathSegment.SEQUENCE}`,
          build: (id: number) => `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.POST}/${PathSegment.SEQUENCE}/${id}`,
        }
      },
      worker: {
        base: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.WORKER}`,
        update: {
          base: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.WORKER}/${PathSegmentAction.UPDATE}`,
          build: (id: number) => `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${PathSegment.WORKER}/${PathSegmentAction.UPDATE}/${id}`,
        },
      },
    }
  }
} as const

export const REDIRECT_PUBLIC_PATH = PATH.login;
export const REDIRECT_PRIVATE_PATH = PATH.dashboard;

export const EXCLUDE_HOME_PUBLIC_PATHS = [PATH.login, PATH.register];