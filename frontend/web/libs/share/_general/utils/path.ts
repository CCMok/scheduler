const enum PathSegment {
  LOGIN = 'login',
  REGISTER = 'register',
  DASHBOARD = 'dashboard',
  ROSTER = 'roster',
  SETTING = 'setting',
  USERS = 'users',
  ORGANIZATION = 'organization',
  ORGANIZATIONS = 'organizations',
  DEPARTMENT = 'department',
  DEPARTMENTS = 'departments',
  POST = 'post',
  POSTS = 'posts',
  WORKER = 'worker',
  WORKERS = 'workers',
  GENERAL = 'general',
}

export const PATH = {
  home: '/',
  login: `/${PathSegment.LOGIN}`,
  register: `/${PathSegment.REGISTER}`,
  dashboard: `/${PathSegment.DASHBOARD}`,
  roster: `/${PathSegment.ROSTER}`,

  setting: {
    general: `/${PathSegment.SETTING}/${PathSegment.GENERAL}`,
    organizations: {
      base: `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}`,
      build: (orgId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${orgId}`,
      departments: {
        build: (orgId: string | number, deptId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${orgId}/${PathSegment.DEPARTMENTS}/${deptId}`,
        posts: (orgId: string | number, deptId: string | number, postId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${orgId}/${PathSegment.DEPARTMENTS}/${deptId}/${PathSegment.POSTS}/${postId}`,
        workers: (orgId: string | number, deptId: string | number, workerId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${orgId}/${PathSegment.DEPARTMENTS}/${deptId}/${PathSegment.WORKERS}/${workerId}`,
      },
    },
    users: `/${PathSegment.SETTING}/${PathSegment.USERS}`,
  }
} as const

export const REDIRECT_PUBLIC_PATH = PATH.login;
export const REDIRECT_PRIVATE_PATH = PATH.roster;

export const EXCLUDE_HOME_PUBLIC_PATHS = [PATH.login, PATH.register];