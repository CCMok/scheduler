import 'server-only';
import { getSession } from '../../_general/managers/session-manager';
import { Role } from '@/libs/share/_general/enums/role';
import prisma from '../../_general/managers/database-manager';
import { isNil } from 'lodash';

const includeWorkersArgs = {
  include: {
    departments: {
      include: {
        workers: true,
      }
    },
  },
}

const includeDepartmentsArgs = {
  include: {
    departments: true,
  },
}

export const getOrganizationsBySession = async () => {
  const sessionPayload = await getSession();
  if (!sessionPayload) return []

  if (sessionPayload.roleEnum === Role.SYSTEM_ADMIN) {
    return await prisma.organization.findMany();
  }

  return await prisma.organization.findMany({
    where: { userOrganizations: { some: { userId: sessionPayload.userId } } },
  })
}

export const getOrganizationsBySessionIncludeDepartments = async () => {
  const sessionPayload = await getSession();
  if (!sessionPayload) return []

  if (sessionPayload.roleEnum === Role.SYSTEM_ADMIN) {
    return await prisma.organization.findMany(includeDepartmentsArgs);
  }

  return await prisma.organization.findMany({
    where: { userOrganizations: { some: { userId: sessionPayload.userId } } },
    ...includeDepartmentsArgs,
  })
}

export const getOrganizationsBySessionIncludeWorkers = async () => {
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

export const findMaxHistoryCount = async (departmentId: number): Promise<number | undefined> => {
  const organization = await prisma.organization.findFirst({
    where: {
      departments: {
        some: {
          id: departmentId,
        },
      },
    },
    select: {
      maxHistoryCount: true,
    }
  })

  return isNil(organization?.maxHistoryCount) ? undefined : organization.maxHistoryCount;
}