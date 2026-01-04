export enum Path {
  HOME = '/',
  LOGIN = '/login',
  ROSTER = '/roster',

  // functions
  NEW = '/new',
}

export const REDIRECT_PRIVATE_PATH = Path.ROSTER + Path.NEW;
export const REDIRECT_PUBLIC_PATH = Path.LOGIN;

export const PUBLIC_PATH_EXCLUDE_HOME = [
  Path.LOGIN,
]