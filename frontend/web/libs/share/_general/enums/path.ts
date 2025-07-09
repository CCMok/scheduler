export enum Path {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/dashboard',
  ROSTER = '/roster',

  SETTING = '/setting',
  SETTING_USER = '/setting/user',
}

export const REDIRECT_PUBLIC_PATH = Path.LOGIN;
export const REDIRECT_PRIVATE_PATH = Path.DASHBOARD;

export const EXCLUDE_HOME_PUBLIC_PATHS = [Path.LOGIN, Path.REGISTER]