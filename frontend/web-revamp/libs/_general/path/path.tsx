export enum Path {
  HOME = '/',
  LOGIN = 'login',
  ROSTER = 'roster',
  NEW = 'new',
}

export const PRIVATE_HOME = [Path.ROSTER, Path.NEW].join('/');