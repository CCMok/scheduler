import 'server-only'
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { DepartmentWithOrganizationChildrenCount } from '../models/department-dao';
import { cache } from 'react';
import { filterAccessibleOrganizations } from '../../access/utils/data-access-utils';
import { Prisma } from '@/external/prisma-generated';

export const getDepartmentsWithOrganizationChildCountService = cache(tryCatch(async (
  id?: number,
  name?: string,
  organizationId?: number,
): Promise<ServiceResponse<DepartmentWithOrganizationChildrenCount[]>> => {
  const entities = await findEntities(id, name, organizationId);
  const filteredEntities = await filterAccessibleOrganizations(entities, entity => entity.organizationId)
  return {
    status: ServiceResponseStatus.OK,
    data: filteredEntities,
  }
}))

const findEntities = async (id?: number, name?: string, organizationId?: number): Promise<DepartmentWithOrganizationChildrenCount[]> => {
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
      organization: true,
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