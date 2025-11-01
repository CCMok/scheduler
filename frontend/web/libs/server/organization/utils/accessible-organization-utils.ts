import 'server-only'
import { getSession } from "../../_general/managers/session-manager";
import { cache } from 'react';
import { Role } from '@/libs/share/_general/enums/role';
import { AccessibleResponse } from '../models/accessible-response';
import prisma from '../../_general/managers/database-manager';
import { Prisma } from '@/external/prisma-generated';

export const getAccessibleOrganization = cache(async (
  userId: number,
  role: Role,
): Promise<AccessibleResponse> => {
  if (role === Role.SYSTEM_ADMIN) {
    return {
      accessAll: true,
    }
  }

  const userOrganizations = await findOrganizations(userId);

  return {
    accessAll: false,
    ids: userOrganizations.map(u => u.organizationId),
  }
})

const findOrganizations = async (userId: number): Promise<{ organizationId: number }[]> => {
  return await prisma.userOrganization.findMany({
    select: {
      organizationId: true,
    },
    where: {
      userId,
    },
    orderBy: {
      organizationId: Prisma.SortOrder.asc,
    },
  })
}

export const getAccessibleDepartment = cache(async (
  userId: number,
  role: Role,
): Promise<AccessibleResponse> => {
  const response = await getAccessibleOrganization(userId, role);
  if (response.accessAll) return response;

  const departments = await findDepartments(response.ids);
  return {
    accessAll: false,
    ids: departments.map(d => d.id),
  }
})

const findDepartments = async (
  organizationIds: number[]
): Promise<{ id: number }[]> => {
  return await prisma.department.findMany({
    select: {
      id: true,
    },
    where: {
      organizationId: { in: organizationIds },
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })
}

export const filterAccessibleOrganization = async <T>(
  entities: T[],
  getOrganizationId: (entity: T) => number,
): Promise<T[]> => {
  const session = await getSession()
  if (!session) return []

  const accessibleOrganization = await getAccessibleOrganization(session.userId, session.roleEnum);

  const filteredEntities = entities.filter(entity => {
    if (accessibleOrganization.accessAll) return true
    const organzationId = getOrganizationId(entity)
    return accessibleOrganization.ids.includes(organzationId)
  })

  return filteredEntities
}