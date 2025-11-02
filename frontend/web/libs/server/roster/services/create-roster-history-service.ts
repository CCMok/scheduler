import 'server-only'
import { CreateRosterHistoryRequest, createRosterHistoryRequestSchema } from '../models/create-roster-history-request'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { ServiceResponseStatus } from '../../../share/_general/enums/service-response-status'
import prisma from '../../_general/managers/database-manager'
import { getSession } from '../../_general/managers/session-manager'
import { Transaction } from '../../_general/models/prisma-transaction'
import { isNil } from 'lodash'
import { serviceWrapper } from '../../_general/services/general-service'
import { Organization } from '@/external/prisma-generated'

export const createRosterHistoryService = async (request: CreateRosterHistoryRequest): Promise<ServiceResponse> =>
  await serviceWrapper<{}>(async () => {
    const parsedRequest = createRosterHistoryRequestSchema.parse(request);

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

const execute = async (request: CreateRosterHistoryRequest, userId: number): Promise<void> => {
  await prisma.$transaction(async tx => {
    await createHisotry(tx, request, userId)

    const organization = await getOrganizationMaxHistoryCount(tx, request.departmentId)
    if (isNil(organization?.maxHistoryCount)) return;

    await deleteExcessHistory(tx, request.departmentId, organization.maxHistoryCount)
  })
}

const createHisotry = async (tx: Transaction, request: CreateRosterHistoryRequest, userId: number): Promise<void> => {
  await tx.rosterHistory.create({
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