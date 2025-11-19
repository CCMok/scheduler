const enum PathSegment {
  LOGIN = 'login',
  REGISTER = 'register',
  RESET_PASSWORD = 'reset-password',
  UPDATE_PASSWORD = 'update-password',
  VERIFY_EMAIL = 'verify-email',
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

  // function
  NEW = 'new',
  HISTORIES = 'histories',
  SENT = 'sent',
}

export const PATH = {
  home: '/',
  login: `/${PathSegment.LOGIN}`,
  register: `/${PathSegment.REGISTER}`,
  resetPassword: `/${PathSegment.RESET_PASSWORD}`,
  updatePassword: `/${PathSegment.UPDATE_PASSWORD}`,
  verifyEmail: {
    base: `/${PathSegment.VERIFY_EMAIL}`,
    sent: (userId: string | number) => `/${PathSegment.VERIFY_EMAIL}/${PathSegment.SENT}/${userId}`,
    build: (token: string) => `/${PathSegment.VERIFY_EMAIL}/${token}`,
  },
  dashboard: `/${PathSegment.DASHBOARD}`,
  roster: {
    new: `/${PathSegment.ROSTER}/${PathSegment.NEW}`,
    histories: {
      base: `/${PathSegment.ROSTER}/${PathSegment.HISTORIES}`,
      build: (rosterHistoryId: string | number) => `/${PathSegment.ROSTER}/${PathSegment.HISTORIES}/${rosterHistoryId}`,
    },
  },
  setting: {
    general: `/${PathSegment.SETTING}/${PathSegment.GENERAL}`,
    organizations: {
      base: `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}`,
      build: (organizationId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${organizationId}`,
      departments: {
        build: (organizationId: string | number, departmentId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${organizationId}/${PathSegment.DEPARTMENTS}/${departmentId}`,
        posts: (organizationId: string | number, departmentId: string | number, postId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${organizationId}/${PathSegment.DEPARTMENTS}/${departmentId}/${PathSegment.POSTS}/${postId}`,
        workers: (organizationId: string | number, departmentId: string | number, workerId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${organizationId}/${PathSegment.DEPARTMENTS}/${departmentId}/${PathSegment.WORKERS}/${workerId}`,
        new: (organizationId: string | number) => `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${organizationId}/${PathSegment.DEPARTMENTS}/${PathSegment.NEW}`,
      },
      new: `/${PathSegment.SETTING}/${PathSegment.ORGANIZATIONS}/${PathSegment.NEW}`,
    },
    departments: `/${PathSegment.SETTING}/${PathSegment.DEPARTMENTS}`,
    users: {
      base: `/${PathSegment.SETTING}/${PathSegment.USERS}`,
      build: (userId: string | number) => `/${PathSegment.SETTING}/${PathSegment.USERS}/${userId}`,
    },
  }
} as const

export const REDIRECT_PUBLIC_PATH = PATH.login;
export const REDIRECT_PRIVATE_PATH = PATH.roster.new;

export const EXCLUDE_HOME_PUBLIC_PATHS = [
  PATH.login,
  PATH.register,
  PATH.resetPassword,
  PATH.updatePassword,
  PATH.verifyEmail.base,
];