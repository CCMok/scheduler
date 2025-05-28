import 'server-only';
import { getSession } from '../../_general/manager/session-manager';
import { Role } from '@/libs/share/_general/enums/role';
import prisma from '../../_general/manager/database-manager';

const includeWorkersArgs = {
  include: {
    departments: {
      include: {
        workers: true,
      }
    },
  },
}

export const getOrganizationsBySession = async () => {
  const sessionPayload = await getSession();
  if (!sessionPayload) return []

  if (sessionPayload.roleEnum === Role.SYSTEM_ADMIN) {
    return await prisma.organization.findMany(includeWorkersArgs);
  }

  return await prisma.organization.findMany({
    where: { userOrganizations: { some: { userId: sessionPayload.userId } } },
    ...includeWorkersArgs,
  })
}