import 'server-only';
import { getSession } from '../../_general/manager/session-manager';
import { findMany, findManyByUserId } from '../repositories/organization-repository';
import { Role } from '@/libs/share/_general/enums/role';

export const getOrganizationsBySession = async (incldueDepartments: boolean | undefined = false) => {
  const sessionPayload = await getSession();
  if (!sessionPayload) return []

  if (sessionPayload.roleEnum === Role.SYSTEM_ADMIN) {
    return await findMany(incldueDepartments);
  }

  return await findManyByUserId(sessionPayload.userId, incldueDepartments)
}