import 'server-only'
import prisma from '../../_general/managers/database-manager';
import { cache } from 'react';
import { RosterHistoryScheduleWithRelated } from '../models/roster-history-dao';
import { tryCatch } from '../../_general/utils/service-utils';
import { filterAccessibleDepartments } from '../../access/utils/data-access-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { Prisma } from '@/external/prisma-generated';

export const getRosterHistorySchedulesWithRelatedService = cache(tryCatch(async (
  id?: number,
  rosterHistoryId?: number,
): Promise<ServiceResponse<RosterHistoryScheduleWithRelated[]>> => {
  const entities = await findEntities(id, rosterHistoryId);
  const filteredEntities = await filterAccessibleDepartments(entities, entity => entity.rosterHistory.departmentId)
  const mappedEntities: RosterHistoryScheduleWithRelated[] = filteredEntities.map(({ rosterHistory, ...rest }) => rest)

  return {
    status: ServiceResponseStatus.OK,
    data: mappedEntities,
  }
}))

const findEntities = async (
  id?: number,
  rosterHistoryId?: number,
) => { 
  return await prisma.rosterHistorySchedule.findMany({
    where: {
      id,
      rosterHistoryId,
    },
    include: {
      rosterHistory: true,
      rosterHistoryScheduleArrangements: {
        include: {
          post: true,
          worker: true,
        },
      },
    },
    orderBy: {
      id: Prisma.SortOrder.asc,
    }
  });
}