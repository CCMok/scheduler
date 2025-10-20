import 'server-only'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { ServiceResponseStatus } from '../../../share/_general/enums/service-response-status'
import prisma from '../../_general/managers/database-manager'
import { getSession } from '../../_general/managers/session-manager'
import { Transaction } from '../../_general/models/prisma-transaction'
import { serviceWrapper } from '../../_general/services/general-service'
import { UpdateRosterHistoryRequest, updateRosterHistoryRequestSchema } from '../models/update-roster-history-request'

export const updateRosterHistoryService = async (request: UpdateRosterHistoryRequest): Promise<ServiceResponse> =>
  await serviceWrapper<{}>(async () => {
    const parsedRequest = updateRosterHistoryRequestSchema.parse(request);

    const session = await getSession();
    if (!session) return {
      status: ServiceResponseStatus.UNAUTHORIZED,
    }

    await execute(parsedRequest, session.userId)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const execute = async (request: UpdateRosterHistoryRequest, userId: number): Promise<void> => {
  await prisma.$transaction(async tx => {
    await updateHisotry(tx, request, userId)
    await deleteOldSchedules(tx, request.id)
    await createNewSchedules(tx, request)
  })
}

const updateHisotry = async (tx: Transaction, request: UpdateRosterHistoryRequest, userId: number): Promise<void> => {
  await tx.rosterHistory.update({
    where: { id: request.id },
    data: {
      updatedAt: new Date(),
      updatedByUserId: userId,
    },
  })
}

const deleteOldSchedules = async (tx: Transaction, rosterHistoryId: number): Promise<void> => {
  await tx.rosterHistorySchedule.deleteMany({
    where: {
      rosterHistoryId,
    },
  })
}

const createNewSchedules = async (tx: Transaction, request: UpdateRosterHistoryRequest): Promise<void> => {
  for (const schedule of request.schedules) {
    await tx.rosterHistorySchedule.create({
      data: {
        rosterHistoryId: request.id,
        day: schedule.day,
        rosterHistoryScheduleArrangements: {
          create: schedule.arrangements.map(arrangement => ({
            postId: arrangement.postId,
            workerId: arrangement.workerId,
          })),
        },
      },
    })
  }
}