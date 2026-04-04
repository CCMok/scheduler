import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { isNil } from 'lodash'
import { UpdateRosterRequest, updateRosterRequestSchema } from './update-roster-request'
import { handlePersistError } from '@/libs/_general/database/database-utils'

export const updateRoster = tryCatch(async (request: UpdateRosterRequest): Promise<ServiceResponse> => {
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
): Promise<ServiceResponse> => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.roster.update({
        where: { id: request.id },
        data: {
          name: request.name,
        },
      })

      for (const timeslot of request.timeslots) {
        await tx.rosterTimeslotAssignment.deleteMany({
          where: {
            rosterTimeslotId: timeslot.id,
          },
        })

        await tx.rosterTimeslotAssignment.createMany({
          data: timeslot.assignments.map(assignment => ({
            rosterTimeslotId: timeslot.id,
            postId: assignment.postId,
            workerId: assignment.workerId,
          })),
          skipDuplicates: true,
        })
      }
    })
  } catch (e) {
    return handlePersistError(e, new Map([
      [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION, () => ({
        isSuccess: false,
        message: Message.ALREADY_USED.replaceAll('{0}', '名稱'),
      })],
    ]))
  }

  return {
    isSuccess: true,
  }
}