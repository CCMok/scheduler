import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { CreateRosterRequest, createRosterRequestSchema } from './create-roster-request'
import { CreateResponseData, ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessTeam } from '@/libs/auth/authorization/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { Roster } from '@/external/prisma/generated/client'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { isNil } from 'lodash'
import { handlePersistError } from '@/libs/_general/database/database-utils'

export const createRoster = tryCatch(async (request: CreateRosterRequest): Promise<ServiceResponse<CreateResponseData>> => {
  const parsedRequest = createRosterRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  return await saveEntity(parsedRequest)
})

export const saveEntity = async (
  request: CreateRosterRequest,
): Promise<ServiceResponse<CreateResponseData>> => {
  let roster: Roster;
  try {
    roster = await prisma.roster.create({
      data: {
        teamId: request.teamId,
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
    data: { id: roster.id },
  }
}