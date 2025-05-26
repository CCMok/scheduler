export enum Path {
  HOME = '/',
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  ROSTER = '/roster',

  SETTING = '/setting',
  SETTING_USER = '/setting/user',
}

export const redirectPublicPath = Path.LOGIN;
export const redirectPrivatePath = Path.DASHBOARD;

export const publicPathExcludeHomes = [Path.LOGIN]