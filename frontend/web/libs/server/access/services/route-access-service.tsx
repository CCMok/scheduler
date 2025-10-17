import 'server-only'
import { getSession } from '../../_general/managers/session-manager';
import { Role } from '../../../share/_general/enums/role';
import { PATH } from '../../../share/_general/utils/path';

// private route only
const ROLE_ACCESS_RULES: Map<Role, string[]> = new Map([
  [Role.ORGANIZATION_ADMIN, [
    PATH.home,
    PATH.dashboard,
    PATH.roster.new,
    PATH.roster.history,
    PATH.setting.general,
    PATH.setting.organizations.base,
    PATH.setting.organizations.build('*'),
    PATH.setting.organizations.departments.build('*', '*'),
    PATH.setting.organizations.departments.posts('*', '*', '*'),
    PATH.setting.organizations.departments.workers('*', '*', '*'),
    PATH.setting.organizations.departments.new('*'),
    PATH.setting.organizations.new,
  ]],
  [Role.OPERATOR, [
    PATH.home,
    PATH.dashboard,
    PATH.roster.new,
    PATH.roster.history,
    PATH.setting.general,
  ]],
]);

export const isAccessable = async (path: string): Promise<boolean> => {
  try {
    const session = await getSession();
    if (!session) {
      return false;
    }

    const userRole = session.roleEnum as Role;

    if (userRole === Role.SYSTEM_ADMIN) {
      return true;
    }

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
