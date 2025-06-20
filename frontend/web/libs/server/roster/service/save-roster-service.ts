import 'server-only'
import { SaveRosterRequest, saveRosterRequestSchema } from '../model/save-roster-request'
import { ServerResponse } from '@/libs/share/_general/model/server-response'
import { ServerResponseStatus } from '../../_general/enums/server-response-status'
import { schemaCheck } from '../../_general/utils/schema-check-utils'
import prisma from '../../_general/manager/database-manager'
import { getSession } from '../../_general/manager/session-manager'

export const saveRoster = async (request: SaveRosterRequest): Promise<ServerResponse> => {
  const isSchemaCheckSuccess = schemaCheck(saveRosterRequestSchema, request);
  if (!isSchemaCheckSuccess) return {
    status: ServerResponseStatus.BAD_REQUEST,
  }

  const session = await getSession();
  if (!session) return {
    status: ServerResponseStatus.UNAUTHORIZED,
  }

  await saveRosterHistory(request, session.userId)

  // TODO: only keep 5 latest histories

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}

const saveRosterHistory = async (request: SaveRosterRequest, userId: number): Promise<void> => {
  await prisma.rosterHistory.create({
    data: {
      departmentId: request.departmentId,
      createdByUserId: userId,
      rosterHistorySchedules: {
        create: request.schedules.map(schedule => ({
          day: schedule.day.toString(),
          rosterHistoryScheduleArrangements: {
            create: schedule.arrangements.map(arrangement => ({
              postId: arrangement.postId,
              workerId: arrangement.workerId,
            })),
          },
        })),
      },
    },
  })
}