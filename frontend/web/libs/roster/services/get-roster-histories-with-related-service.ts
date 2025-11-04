import 'server-only'
import prisma from '../../_general/managers/database-manager';
import { cache } from 'react';
import { RosterHistoryWithRelated } from '../models/roster-history-dao';
import { Prisma } from '@/external/prisma-generated';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { filterAccessibleDepartments } from '../../access/utils/data-access-utils';

export const getRosterHistoriesWithRelatedService = cache(tryCatch(async (
  id?: number,
  departmentId?: number,
): Promise<ServiceResponse<RosterHistoryWithRelated[]>> => {
  const entities = await findEntities(id, departmentId);
  const filteredEntities = await filterAccessibleDepartments(entities, entity => entity.departmentId)

  return {
    status: ServiceResponseStatus.OK,
    data: filteredEntities,
  }
}))

const findEntities = async (
  id?: number,
  departmentId?: number,
): Promise<RosterHistoryWithRelated[]> => {
  return await prisma.rosterHistory.findMany({
    where: {
      id,
      departmentId,
    },
    include: {
      department: {
        include: {
          organization: true,
        },
      },
      createdByUser: {
        omit: {
          password: true,
        },
      },
    },
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
    },
  })
}