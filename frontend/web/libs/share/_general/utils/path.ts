const enum PathSegment {
  LOGIN = 'login',
  REGISTER = 'register',
  DASHBOARD = 'dashboard',
  ROSTER = 'roster',
  SETTING = 'setting',
  USER = 'user',
  ORGANIZATION = 'organization',
  ORGANIZATIONS = 'organizations',
  DEPARTMENT = 'department',
  POST = 'post',
  POSTS = 'posts',
  WORKER = 'worker',
  WORKERS = 'workers',
  SEQUENCE = 'sequence',
}

export const PATH = {
  home: '/',
  login: `/${PathSegment.LOGIN}`,
  register: `/${PathSegment.REGISTER}`,
  dashboard: `/${PathSegment.DASHBOARD}`,
  roster: `/${PathSegment.ROSTER}`,

  setting: {
    user: `/${PathSegment.SETTING}/${PathSegment.USER}`,
    organizations: `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}`,
    organization: {
      build: (id: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATION}/${id}`,
    },
    post: {
      build: (id: string | number) => `/${PathSegment.SETTING}/${PathSegment.POST}/${id}`,
    },
    posts: `/${PathSegment.SETTING}/${PathSegment.POSTS}`,
    worker: {
      build: (id: string | number) => `/${PathSegment.SETTING}/${PathSegment.WORKER}/${id}`,
    },
    workers: `/${PathSegment.SETTING}/${PathSegment.WORKERS}`,
    department: {
      build: (id: string | number) => `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${id}`,
      posts: {
        sequence: {
          build: (departmentId: string | number) => `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${departmentId}/${PathSegment.POSTS}/${PathSegment.SEQUENCE}`,
        }
      },
    }
  }
} as const

export const REDIRECT_PUBLIC_PATH = PATH.login;
export const REDIRECT_PRIVATE_PATH = PATH.dashboard;

export const EXCLUDE_HOME_PUBLIC_PATHS = [PATH.login, PATH.register];