import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse, UpdateRosterResponseData } from '@/libs/_general/service/response'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { isNil } from 'lodash'
import { UpdateRosterRequest, updateRosterRequestSchema } from './update-roster-request'
import { handlePersistError } from '@/libs/_general/database/database-utils'

export const updateRoster = tryCatch(async (request: UpdateRosterRequest): Promise<ServiceResponse<UpdateRosterResponseData>> => {
  const parsedRequest = updateRosterRequestSchema.parse(request)

  const teamId = await getTeamId(parsedRequest.id)
  if (isNil(teamId)) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '值班表'),
  }

  const canAccess = await checkCanAccessTeam(teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  return await saveEntity(parsedRequest)
})

const getTeamId = async (rosterId: number): Promise<number | undefined> => {
  const roster = await prisma.roster.findUnique({
    select: {
      teamId: true,
    },
    where: {
      id: rosterId,
    },
  })
  return roster?.teamId ?? undefined;
}

export const saveEntity = async (
  request: UpdateRosterRequest,
): Promise<ServiceResponse<UpdateRosterResponseData>> => {
  try {
    const updated = await prisma.$transaction(async (tx) => {
      await tx.rosterTimeslot.deleteMany({
        where: { rosterId: request.id },
      })

      return await tx.roster.update({
        where: { id: request.id },
        data: {
          name: request.name,
          timeslots: {
            create: request.timeslots.map(timeslot => ({
              name: timeslot.name,
              assignments: {
                create: timeslot.assignments.map(post => ({
                  postId: post.postId,
                  workerId: isNil(post.workerId) ? null : post.workerId,
                })),
              },
              offWorkers: {
                create: timeslot.offWorkerIds.map(workerId => ({
                  workerId,
                })),
              },
            })),
          },
        },
      })
    })

    return {
      isSuccess: true,
      data: { updatedAt: updated.updatedAt.toISOString() },
    }
  } catch (e) {
    return handlePersistError(e, new Map([
      [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION, () => ({
        isSuccess: false,
        message: Message.ALREADY_USED.replaceAll('{0}', '名稱'),
      })],
    ]))
  }
}
