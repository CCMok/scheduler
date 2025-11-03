import 'server-only'
import prisma from '../../_general/managers/database-manager';
import { cache } from 'react';
import { RosterHistoryOffWorkerWithDays } from '../models/roster-history-dao';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { filterAccessibleDepartments } from '../../organization/utils/access-organization-utils';
import { Prisma } from '@/external/prisma-generated';

export const getRosterHistoryOffWorkersWithDaysService = cache(tryCatch(async (
  id?: number,
  rosterHistoryId?: number,
  workerId?: number,
): Promise<ServiceResponse<RosterHistoryOffWorkerWithDays[]>> => {
  const entities = await findEntities(id, rosterHistoryId, workerId);
  const filteredEntities = await filterAccessibleDepartments(entities, entity => entity.rosterHistory.departmentId)
  const mappedEntities: RosterHistoryOffWorkerWithDays[] = filteredEntities.map(({ rosterHistory, ...rest }) => rest)

  return {
    status: ServiceResponseStatus.OK,
    data: mappedEntities,
  }
}))

const findEntities = async (
  id?: number,
  rosterHistoryId?: number,
  workerId?: number,
) => { 
  return await prisma.rosterHistoryOffWorker.findMany({
    where: {
      id,
      rosterHistoryId,
      workerId,
    },
    include: {
      rosterHistoryOffWorkerDays: true,
      rosterHistory: true,
    },
    orderBy: {
      id: Prisma.SortOrder.asc,
    }
  });
}