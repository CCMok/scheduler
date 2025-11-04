import 'server-only'
import { CreateRosterHistoryRequest, createRosterHistoryRequestSchema } from '../models/create-roster-history-request'
import prisma from '../../_general/managers/database-manager'
import { getSession } from '../../access/managers/session-manager'
import { Transaction } from '../../_general/models/prisma-transaction'
import { isNil } from 'lodash'
import { Organization, Prisma, RosterHistory } from '@/external/prisma-generated'
import { tryCatch } from '../../_general/utils/service-utils'
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response'

export const createRosterHistoryService = tryCatch(async (
  request: CreateRosterHistoryRequest,
): Promise<ServiceResponse<number>> => {
  const parsedRequest = createRosterHistoryRequestSchema.parse(request);

  const session = await getSession();
  if (!session) return {
    status: ServiceResponseStatus.UNAUTHORIZED,
  }

  const rosterHistory = await execute(parsedRequest, session.userId)

  return {
    status: ServiceResponseStatus.OK,
    data: rosterHistory.id,
  }
})

const execute = async (request: CreateRosterHistoryRequest, userId: number): Promise<RosterHistory> => {
  return await prisma.$transaction(async tx => {
    const rosterHistory = await createHisotry(tx, request, userId)

    const organization = await getOrganizationMaxHistoryCount(tx, request.departmentId)
    if (!isNil(organization?.maxHistoryCount)) {
      await deleteExcessHistory(tx, request.departmentId, organization.maxHistoryCount)
    }

    return rosterHistory
  })
}

const createHisotry = async (tx: Transaction, request: CreateRosterHistoryRequest, userId: number): Promise<RosterHistory> => {
  return await tx.rosterHistory.create({
    data: {
      departmentId: request.departmentId,
      createdByUserId: userId,
      rosterHistorySchedules: {
        create: request.schedules.map(schedule => ({
          day: schedule.day,
          rosterHistoryScheduleArrangements: {
            create: schedule.arrangements.map(arrangement => ({
              postId: arrangement.postId,
              workerId: arrangement.workerId,
            })),
          },
        })),
      },
      rosterHistoryOffWorkers: {
        create: request.offs.map(off => ({
          workerId: off.workerId,
          rosterHistoryOffWorkerDays: {
            create: off.days.map(day => ({
              day,
            })),
          },
        })),
      },
    },
  })
}

const getOrganizationMaxHistoryCount = async (tx: Transaction, departmentId: number): Promise<Organization | null> => {
  return await tx.organization.findFirst({
    where: {
      departments: {
        some: {
          id: departmentId,
        },
      },
    },
  })
}

const deleteExcessHistory = async (tx: Transaction, departmentId: number, maxHistoryCount: number): Promise<void> => {
  const historiesId = await tx.rosterHistory.findMany({
    where: {
      departmentId,
    },
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
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