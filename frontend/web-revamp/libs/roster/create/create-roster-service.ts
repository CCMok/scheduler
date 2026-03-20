import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { CreateRosterRequest, createRosterRequestSchema } from './create-roster-request'
import { CreateResponseData, ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessTeam } from '@/libs/auth/authorization/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { Prisma } from '@/external/prisma/generated/client'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { isNil } from 'lodash'

export const createRoster = tryCatch(async (request: CreateRosterRequest): Promise<ServiceResponse<CreateResponseData>> => {
  const parsedRequest = createRosterRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  let id: number;
  try {
    id = await saveEntity(parsedRequest)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
      return {
        isSuccess: false,
        message: Message.ALREADY_USED.replaceAll('{0}', '名稱'),
      }
    }

    console.error('Failed to save roster')
    console.error(e)
    return {
      isSuccess: false,
      message: Message.SYSTEM_ERROR,
    };
  }

  return {
    isSuccess: true,
    data: { id },
  }
})

export const saveEntity = async (
  request: CreateRosterRequest,
): Promise<number> => {
  const roster = await prisma.roster.create({
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

  return roster.id;
}