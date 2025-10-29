import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';
import { RosterHistoryOffWorkerRelated } from '../models/roster-history-dao';
import { GetRosterHistoryOffWorkersRequest, getRosterHistoryOffWorkersRequestSchema } from '../models/get-roster-history-off-workers-request';

export const getRosterHistoryOffWorkersService = cache(async (request: GetRosterHistoryOffWorkersRequest): Promise<ServiceResponse<RosterHistoryOffWorkerRelated[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getRosterHistoryOffWorkersRequestSchema.parse(request)

    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetRosterHistoryOffWorkersRequest): Promise<RosterHistoryOffWorkerRelated[]> => { 
  return await prisma.rosterHistoryOffWorker.findMany({
    where: {
      rosterHistoryId: request.where?.rosterHistoryId,
    },
    include: {
      rosterHistoryOffWorkerDays: true,
    },
  });
}