import 'server-only'
import { getSession } from "../managers/session-manager";
import { cache } from 'react';
import { Role } from '@/libs/role/enums/role';
import { DataAccessResponse } from '../models/data-access-response';
import prisma from '../../_general/managers/database-manager';
import { Prisma } from '@/external/prisma-generated';

const getAccessibleOrganizations = cache(async (): Promise<DataAccessResponse> => {
  const session = await getSession();
  if (!session) return {
    accessAll: false,
    ids: [],
  };

  if (session.roleEnum === Role.SYSTEM_ADMIN) return {
    accessAll: true,
  }

  const userOrganizations = await prisma.userOrganization.findMany({
    select: {
      organizationId: true,
    },
    where: {
      userId: session.userId,
    },
    orderBy: {
      organizationId: Prisma.SortOrder.asc,
    },
  })

  return {
    accessAll: false,
    ids: userOrganizations.map(u => u.organizationId),
  }
})

const getAccessibleDepartments = cache(async (): Promise<DataAccessResponse> => {
  const response = await getAccessibleOrganizations();
  if (response.accessAll) return response;

  const departments = await prisma.department.findMany({
    select: {
      id: true,
    },
    where: {
      organizationId: { in: response.ids },
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })

  return {
    accessAll: false,
    ids: departments.map(d => d.id),
  }
})

const getAccessiblePosts = cache(async (): Promise<DataAccessResponse> => {
  const response = await getAccessibleDepartments();
  if (response.accessAll) return response;

  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
    where: {
      departmentId: { in: response.ids },
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })

  return {
    accessAll: false,
    ids: posts.map(d => d.id),
  }
})

const getAccessibleWorkers = cache(async (): Promise<DataAccessResponse> => {
  const response = await getAccessibleDepartments();
  if (response.accessAll) return response;

  const workers = await prisma.worker.findMany({
    select: {
      id: true,
    },
    where: {
      departmentId: { in: response.ids },
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })

  return {
    accessAll: false,
    ids: workers.map(d => d.id),
  }
})

export const checkCanAccessOrganization = cache(async (id: number): Promise<boolean> => {
  const accessibleOrganization = await getAccessibleOrganizations();
  if (accessibleOrganization.accessAll) return true;
  return accessibleOrganization.ids.includes(id);
})

export const checkCanAccessDepartment = cache(async (id: number): Promise<boolean> => {
  const accessibleDepartment = await getAccessibleDepartments();
  if (accessibleDepartment.accessAll) return true;
  return accessibleDepartment.ids.includes(id);
})

export const checkCanAccessPost = cache(async (id: number): Promise<boolean> => {
  const accessiblePost = await getAccessiblePosts();
  if (accessiblePost.accessAll) return true;
  return accessiblePost.ids.includes(id);
})

export const checkCanAccessWorker = cache(async (id: number): Promise<boolean> => {
  const accessibleWorker = await getAccessibleWorkers();
  if (accessibleWorker.accessAll) return true;
  return accessibleWorker.ids.includes(id);
})

export const filterAccessibleOrganizations = async <T>(
  entities: T[],
  getOrganizationId: (entity: T) => number,
): Promise<T[]> => {
  const accessibleOrganization = await getAccessibleOrganizations();

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
  const accessibleDepartment = await getAccessibleDepartments()

  if (accessibleDepartment.accessAll) return entities;

  const filteredEntities = entities.filter(entity => {
    const departmentId = getDepartmentId(entity)
    return accessibleDepartment.ids.includes(departmentId)
  })

  return filteredEntities
}