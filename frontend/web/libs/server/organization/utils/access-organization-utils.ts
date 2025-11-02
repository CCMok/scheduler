import 'server-only'
import { getSession } from "../../_general/managers/session-manager";
import { cache } from 'react';
import { Role } from '@/libs/share/_general/enums/role';
import { AccessibleResponse } from '../models/accessible-response';
import prisma from '../../_general/managers/database-manager';
import { Prisma } from '@/external/prisma-generated';

const getAccessibleOrganization = cache(async (): Promise<AccessibleResponse> => {
  const session = await getSession();
  if (!session) return {
    accessAll: false,
    ids: [],
  };

  if (session.roleEnum === Role.SYSTEM_ADMIN) {
    return {
      accessAll: true,
    }
  }

  const userOrganizations = await findOrganizations(session.userId);

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

const getAccessibleDepartment = cache(async (): Promise<AccessibleResponse> => {
  const response = await getAccessibleOrganization();
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

const getAccessiblePost = cache(async (): Promise<AccessibleResponse> => {
  const response = await getAccessibleDepartment();
  if (response.accessAll) return response;

  const posts = await findPosts(response.ids);

  return {
    accessAll: false,
    ids: posts.map(d => d.id),
  }
})

const findPosts = async (
  departmentIds: number[]
): Promise<{ id: number }[]> => {
  return await prisma.post.findMany({
    select: {
      id: true,
    },
    where: {
      departmentId: { in: departmentIds },
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })
}

export const checkCanAccessOrganization = cache(async (id: number): Promise<boolean> => {
  const accessibleOrganization = await getAccessibleOrganization();
  if (accessibleOrganization.accessAll) return true;
  return accessibleOrganization.ids.includes(id);
})

export const checkCanAccessDepartment = cache(async (id: number): Promise<boolean> => {
  const accessibleDepartment = await getAccessibleDepartment();
  if (accessibleDepartment.accessAll) return true;
  return accessibleDepartment.ids.includes(id);
})

export const checkCanAccessPost = cache(async (id: number): Promise<boolean> => {
  const accessiblePost = await getAccessiblePost();
  if (accessiblePost.accessAll) return true;
  return accessiblePost.ids.includes(id);
})

export const filterAccessibleOrganizations = async <T>(
  entities: T[],
  getOrganizationId: (entity: T) => number,
): Promise<T[]> => {
  const accessibleOrganization = await getAccessibleOrganization();

  if (accessibleOrganization.accessAll) return entities;

  const filteredEntities = entities.filter(entity => {
    const organizationId = getOrganizationId(entity)
    return accessibleOrganization.ids.includes(organizationId)
  })

  return filteredEntities
}

export const filterAccessibleDepartments = async <T>(
  entities: T[],
  getDepartmentId: (entity: T) => number,
): Promise<T[]> => {
  const accessibleDepartment = await getAccessibleDepartment()

  if (accessibleDepartment.accessAll) return entities;

  const filteredEntities = entities.filter(entity => {
    const departmentId = getDepartmentId(entity)
    return accessibleDepartment.ids.includes(departmentId)
  })

  return filteredEntities
}