import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { handlePersistError } from '@/libs/_general/database/database-utils'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { createPostRequestSchema, CreatePostRequest } from './create-post-request'

export const createPost = tryCatch(async (request: CreatePostRequest): Promise<ServiceResponse<number>> => {
  const parsedRequest = createPostRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const isWorkerValid = await checkWorker(parsedRequest.teamId, parsedRequest.workers)
  if (!isWorkerValid) return {
    isSuccess: false,
    message: '職員不屬於同一團隊',
  }

  return await saveEntity(parsedRequest);
})

const checkWorker = async (teamId: number, workers: number[]): Promise<boolean> => {
  const count = await prisma.worker.count({
    where: {
      id: { in: workers },
      teamId,
    },
  })
  return count === workers.length
}

const saveEntity = async (request: CreatePostRequest): Promise<ServiceResponse<number>> => {
  let createdId: number;
  try {
    const createdPost = await prisma.post.create({
      data: { 
        teamId: request.teamId,
        name: request.name,
        workers: {
          create: request.workers.map(workerId => ({
            workerId,
          })),
        },
      },
    })
    createdId = createdPost.id;
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
    data: createdId,
  }
}