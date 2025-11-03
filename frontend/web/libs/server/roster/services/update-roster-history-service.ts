import 'server-only'
import prisma from '../../_general/managers/database-manager'
import { getSession } from '../../_general/managers/session-manager'
import { Transaction } from '../../_general/models/prisma-transaction'
import { UpdateRosterHistoryRequest, updateRosterHistoryRequestSchema } from '../models/update-roster-history-request'
import { tryCatch } from '../../_general/services/try-catch-wrapper'
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response'

export const updateRosterHistoryService = tryCatch(async (
  request: UpdateRosterHistoryRequest,
): Promise<ServiceResponse> => {
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
    await deleteOldOffWorkers(tx, request.id)
    await createNewOffWorkers(tx, request)
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

const deleteOldOffWorkers = async (tx: Transaction, rosterHistoryId: number): Promise<void> => {
  await tx.rosterHistoryOffWorker.deleteMany({
    where: {
      rosterHistoryId,
    },
  })
}

const createNewOffWorkers = async (tx: Transaction, request: UpdateRosterHistoryRequest): Promise<void> => {
  if (!request.offWorkers || request.offWorkers.length === 0) return;

  for (const offWorker of request.offWorkers) {
    await tx.rosterHistoryOffWorker.create({
      data: {
        rosterHistoryId: request.id,
        workerId: offWorker.workerId,
        rosterHistoryOffWorkerDays: {
          create: offWorker.days.map(day => ({
            day,
          })),
        },
      },
    })
  }
}