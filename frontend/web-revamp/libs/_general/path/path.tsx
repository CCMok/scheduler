export enum Path {
  HOME = '/',
  LOGIN = '/login',
  SIGN_UP = '/sign-up',
  VERIFY_EMAIL = '/verify-email',
  ROSTER = '/roster',

  // functions
  AUTO_NEW = '/auto-new',
  EDIT = '/edit',
}

export const REDIRECT_PRIVATE_PATH = Path.ROSTER;
export const REDIRECT_PUBLIC_PATH = Path.LOGIN;

export const PUBLIC_PATH_EXCLUDE_HOME = [
  Path.LOGIN,
  Path.SIGN_UP,
  Path.VERIFY_EMAIL,
]