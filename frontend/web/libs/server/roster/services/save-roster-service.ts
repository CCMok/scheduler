import 'server-only'
import { SaveRosterRequest, saveRosterRequestSchema } from '../models/save-roster-request'
import { ServerResponse } from '@/libs/share/_general/models/server-response'
import { ServerResponseStatus } from '../../_general/enums/server-response-status'
import { schemaCheck } from '../../_general/utils/schema-check-utils'
import prisma from '../../_general/managers/database-manager'
import { getSession } from '../../_general/managers/session-manager'
import { Transaction } from '../../_general/models/prisma-transaction'
import { isNil } from 'lodash'
import { findMaxHistoryCount } from '../../organization/repositories/organization-repository'

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

    const maxHistoryCount = await findMaxHistoryCount(request.departmentId)
    if (isNil(maxHistoryCount)) return;

    await deleteExcessHistory(tx, request.departmentId, maxHistoryCount)
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

const getMaxHistoryCount = async (tx: Transaction, departmentId: number): Promise<number | undefined> => {
  const organization = await tx.organization.findFirstOrThrow({
    where: {
      departments: {
        some: {
          id: departmentId,
        },
      },
    },
    select: {
      maxHistoryCount: true,
    }
  })

  return isNil(organization.maxHistoryCount) ? undefined : organization.maxHistoryCount;
}

const deleteExcessHistory = async (tx: Transaction, departmentId: number, maxHistoryCount: number): Promise<void> => {
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

  if (historiesId.length > maxHistoryCount) {
    const idsToDelete = historiesId.slice(maxHistoryCount).map(h => h.id);
    await tx.rosterHistory.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });
  }
}