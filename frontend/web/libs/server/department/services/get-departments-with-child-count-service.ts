import 'server-only'
import { ServiceResponse, ServiceResponseStatus } from '@/libs/server/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { DepartmentWithChildCount } from '../models/department-dao';
import { cache } from 'react';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { Prisma } from '@/external/prisma-generated';
import { filterAccessibleOrganizations } from '../../organization/utils/access-organization-utils';

export const getDepartmentsWithChildCountService = cache(tryCatch(async (
  id?: number,
  name?: string,
  organizationId?: number,
): Promise<ServiceResponse<DepartmentWithChildCount[]>> => {
  const entities = await findEntities(id, name, organizationId);
  const filteredEntities = await filterAccessibleOrganizations(entities, entity => entity.organizationId)
  return {
    status: ServiceResponseStatus.OK,
    data: filteredEntities,
  }
}))

const findEntities = async (id?: number, name?: string, organizationId?: number): Promise<DepartmentWithChildCount[]> => {
  return await prisma.department.findMany({
    where: {
      id,
      name,
      organizationId,
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
    include: {
      _count: {
        select: {
          workers: {
            where: { isDeleted: false },
          },
          posts: {
            where: { isDeleted: false },
          },
        },
      },
    },
  })
}