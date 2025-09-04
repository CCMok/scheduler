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
  DEPARTMENTS = 'departments',
  POST = 'post',
  POSTS = 'posts',
  WORKER = 'worker',
  WORKERS = 'workers',
}

export const PATH = {
  home: '/',
  login: `/${PathSegment.LOGIN}`,
  register: `/${PathSegment.REGISTER}`,
  dashboard: `/${PathSegment.DASHBOARD}`,
  roster: `/${PathSegment.ROSTER}`,

  setting: {
    user: `/${PathSegment.SETTING}/${PathSegment.USER}`,

    organizations: {
      base: `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}`,
      build: (orgId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${orgId}`,
      departments: {
        build: (orgId: string | number, deptId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${orgId}/${PathSegment.DEPARTMENTS}/${deptId}`,
        posts: (orgId: string | number, deptId: string | number, postId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${orgId}/${PathSegment.DEPARTMENTS}/${deptId}/${PathSegment.POSTS}/${postId}`,
        workers: (orgId: string | number, deptId: string | number, workerId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${orgId}/${PathSegment.DEPARTMENTS}/${deptId}/${PathSegment.WORKERS}/${workerId}`,
      },
    },
    departments: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENTS}`,
    posts: `/${PathSegment.SETTING}/${PathSegment.POSTS}`,
    workers: `/${PathSegment.SETTING}/${PathSegment.WORKERS}`,








    // TODO: remove
    organizationsOld: `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}`,
    organization: {
      build: (id: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATION}/${id}`,
      department: {
        build: (orgId: string | number, deptId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATION}/${orgId}/${PathSegment.DEPARTMENT}/${deptId}`,
      },
    },
    
    department: {
      build: (id: string | number) => `/${PathSegment.SETTING}/${PathSegment.DEPARTMENT}/${id}`,
    },
    post: {
      build: (id: string | number) => `/${PathSegment.SETTING}/${PathSegment.POST}/${id}`,
    },
    worker: {
      build: (id: string | number) => `/${PathSegment.SETTING}/${PathSegment.WORKER}/${id}`,
    },
  }
} as const

export const REDIRECT_PUBLIC_PATH = PATH.login;
export const REDIRECT_PRIVATE_PATH = PATH.dashboard;

export const EXCLUDE_HOME_PUBLIC_PATHS = [PATH.login, PATH.register];