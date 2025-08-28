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
  POSTS = 'posts',
  WORKER = 'worker',
  WORKERS = 'workers',
  SEQUENCE = 'sequence',
}

const enum PathSegmentAction {
  EDIT = 'edit',
}

export const PATH = {
  home: '/',
  login: `/${PathSegment.LOGIN}`,
  register: `/${PathSegment.REGISTER}`,
  dashboard: `/${PathSegment.DASHBOARD}`,
  roster: `/${PathSegment.ROSTER}`,

  setting: {
    user: `/${PathSegment.SETTING}/${PathSegment.USER}`,
    organization: `/${PathSegment.SETTING}/${PathSegment.ORGANIZATION}`,
    post: {
      edit: {
        build: (id: number) => `/${PathSegment.SETTING}/${PathSegment.POST}/${id}/${PathSegmentAction.EDIT}`,
      },
    },
    posts: `/${PathSegment.SETTING}/${PathSegment.POSTS}`,
    worker: {
      edit: {
        build: (id: number) => `/${PathSegment.SETTING}/${PathSegment.WORKER}/${id}/${PathSegmentAction.EDIT}`,
      },
    },
    workers: `/${PathSegment.SETTING}/${PathSegment.WORKERS}`,
    department: {
      base: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}`,
      posts: {
        sequence: {
          build: (departmentId: number) => `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${departmentId}/${PathSegment.POSTS}/${PathSegment.SEQUENCE}`,
        }
      },
    }
  }
} as const

export const REDIRECT_PUBLIC_PATH = PATH.login;
export const REDIRECT_PRIVATE_PATH = PATH.dashboard;

export const EXCLUDE_HOME_PUBLIC_PATHS = [PATH.login, PATH.register];