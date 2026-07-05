import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { handlePersistError } from '@/libs/_general/database/database-utils'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { createWorkerRequestSchema, CreateWorkerRequest } from './create-worker-request'

export const createWorker = tryCatch(async (request: CreateWorkerRequest): Promise<ServiceResponse<number>> => {
  const parsedRequest = createWorkerRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const isPostValid = await checkPost(parsedRequest.teamId, parsedRequest.posts)
  if (!isPostValid) return {
    isSuccess: false,
    message: '職位不屬於同一團隊',
  }

  return await saveEntity(parsedRequest);
})

const checkPost = async (teamId: number, posts: number[]): Promise<boolean> => {
  const count = await prisma.post.count({
    where: {
      id: { in: posts },
      teamId,
    },
  })
  return count === posts.length
}

const saveEntity = async (request: CreateWorkerRequest): Promise<ServiceResponse<number>> => {
  let createdId: number;
  try {
    const createdWorker = await prisma.worker.create({
      data: { 
        teamId: request.teamId,
        name: request.name,
        posts: {
          create: request.posts.map(postId => ({
            postId,
          })),
        },
      },
    })
    createdId = createdWorker.id;
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