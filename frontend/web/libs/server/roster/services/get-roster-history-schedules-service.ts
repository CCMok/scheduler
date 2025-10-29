import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';
import { RosterHistoryScheduleRelated } from '../models/roster-history-dao';
import { GetRosterHistorySchedulesRequest, getRosterHistorySchedulesRequestSchema } from '../models/get-roster-history-schedules-request';

export const getRosterHistorySchedulesService = cache(async (request: GetRosterHistorySchedulesRequest): Promise<ServiceResponse<RosterHistoryScheduleRelated[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getRosterHistorySchedulesRequestSchema.parse(request)

    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetRosterHistorySchedulesRequest): Promise<RosterHistoryScheduleRelated[]> => { 
  return await prisma.rosterHistorySchedule.findMany({
    where: {
      rosterHistoryId: request.where?.rosterHistoryId,
    },
    include: {
      rosterHistoryScheduleArrangements: {
        include: {
          post: true,
          worker: true,
        },
      },
    },
  });
}