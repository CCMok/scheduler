import 'server-only'
import { getSession } from '../../_general/managers/session-manager';
import { Role } from '../../../share/_general/enums/role';
import { PATH } from '../../../share/_general/utils/path';

// private route only
const ROLE_ACCESS_RULES: Map<Role, string[]> = new Map([
  [Role.SYSTEM_ADMIN, [
    PATH.home,
    PATH.dashboard,
    PATH.roster,
    PATH.setting.user,
    PATH.setting.organizations,
    PATH.setting.organization.build('*'),
    PATH.setting.post.build('*'),
    PATH.setting.posts,
    PATH.setting.worker.build('*'),
    PATH.setting.workers,
    PATH.setting.department.posts.sequence.build('*'),
  ]],
  [Role.ORGANIZATION_ADMIN, [
    PATH.home,
    PATH.dashboard,
    PATH.roster,
    PATH.setting.user,
    PATH.setting.organizations,
    PATH.setting.organization.build('*'),
    PATH.setting.post.build('*'),
    PATH.setting.posts,
    PATH.setting.worker.build('*'),
    PATH.setting.workers,
    PATH.setting.department.posts.sequence.build('*'),
  ]],
  [Role.OPERATOR, [
    PATH.home,
    PATH.dashboard,
    PATH.roster,
    PATH.setting.user,
    PATH.setting.post.build('*'),
    PATH.setting.posts,
    PATH.setting.worker.build('*'),
    PATH.setting.workers,
    PATH.setting.department.posts.sequence.build('*'),
  ]],
]);

export const isAccessable = async (path: string): Promise<boolean> => {
  try {
    const session = await getSession();
    if (!session) {
      return false;
    }

    const userRole = session.roleEnum as Role;
    const allowedPaths = ROLE_ACCESS_RULES.get(userRole);

    if (!allowedPaths) {
      return false;
    }

    if (allowedPaths.includes(path)) {
      return true;
    }

    return allowedPaths.some(allowedPath => {
      if (allowedPath.includes('*')) {
        return matchDynamicPath(path, allowedPath);
      }
      return false;
    });
  } catch (error) {
    console.error('Error checking path access:', error);
    return false;
  }
};

/**
 * Matches a dynamic path pattern with wildcards.
 * Converts patterns like \/setting\/post\/*\/edit to regex and tests against actual paths.
 * 
 * @param actualPath - The actual path to test
 * @param pattern - The pattern with wildcards (e.g., \/setting\/post\/*\/edit)
 * @returns boolean - True if path matches pattern
 */
const matchDynamicPath = (actualPath: string, pattern: string): boolean => {
  const regexPattern = pattern
    .replace(/\*/g, '[^/]+')
    .replace(/\//g, '\\/');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(actualPath);
};
