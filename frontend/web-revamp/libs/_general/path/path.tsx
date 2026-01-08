export enum Path {
  HOME = '/',
  LOGIN = '/login',
  ROSTER = '/roster',

  // functions
  AUTO_NEW = '/auto-new',
}

export const REDIRECT_PRIVATE_PATH = Path.ROSTER;
export const REDIRECT_PUBLIC_PATH = Path.LOGIN;

export const PUBLIC_PATH_EXCLUDE_HOME = [
  Path.LOGIN,
]