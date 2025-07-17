export enum Path {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/dashboard',
  ROSTER = '/roster',

  SETTING_USER = '/setting/user',
  SETTING_ORGANIZATION = '/setting/organization',
  SETTING_DEPARTMENT = '/setting/department',
}

export const REDIRECT_PUBLIC_PATH = Path.LOGIN;
export const REDIRECT_PRIVATE_PATH = Path.DASHBOARD;

export const EXCLUDE_HOME_PUBLIC_PATHS = [Path.LOGIN, Path.REGISTER]