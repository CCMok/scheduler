import 'server-only'
import { SaveRosterRequest, saveRosterRequestSchema } from '../model/save-roster-request'
import { ServerResponse } from '@/libs/share/_general/model/server-response'
import { ServerResponseStatus } from '../../_general/enums/server-response-status'
import { schemaCheck } from '../../_general/utils/schema-check-utils'
import prisma from '../../_general/manager/database-manager'
import { getSession } from '../../_general/manager/session-manager'
import { Transaction } from '../../_general/models/prisma-transaction'
import { MAX_HISTORY_COUNT } from '@/libs/share/roster/constants/roster-constant'

export const saveRoster = async (request: SaveRosterRequest): Promise<ServerResponse> => {
  const isSchemaCheckSuccess = schemaCheck(saveRosterRequestSchema, request);
  if (!isSchemaCheckSuccess) return {
    status: ServerResponseStatus.BAD_REQUEST,
  }

  const session = await getSession();
  if (!session) return {
    status: ServerResponseStatus.UNAUTHORIZED,
  }

  await updateRecord(request, session.userId)

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}

const updateRecord = async (request: SaveRosterRequest, userId: number): Promise<void> => {
  await prisma.$transaction(async tx => {
    await saveHisotry(tx, request, userId)
    await deleteExcessHistory(tx, request.departmentId)
  })
}

const saveHisotry = async (tx: Transaction, request: SaveRosterRequest, userId: number): Promise<void> => {
  await tx.rosterHistory.create({
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

const deleteExcessHistory = async (tx: Transaction, departmentId: number): Promise<void> => {
  const historiesId = await tx.rosterHistory.findMany({
    where: {
      departmentId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
    },
  });

  if (historiesId.length > MAX_HISTORY_COUNT) {
    const idsToDelete = historiesId.slice(MAX_HISTORY_COUNT).map(h => h.id);
    await tx.rosterHistory.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });
  }
}