import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { UpdateWorkerPostsRequest, updateWorkerPostsRequestSchema } from './update-worker-posts-request'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'

export const updateWorkerPosts = tryCatch(async (request: UpdateWorkerPostsRequest): Promise<ServiceResponse> => {
  const parsedRequest = updateWorkerPostsRequestSchema.parse(request)

  const teamIdResponse = await getTeamId(parsedRequest)
  if (!teamIdResponse.isSuccess) return teamIdResponse;

  const teamId = teamIdResponse.data;

  const canAccess = await checkCanAccessTeam(teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  await saveEntity(parsedRequest);

  return {
    isSuccess: true,
  }
})

const getTeamId = async (request: UpdateWorkerPostsRequest): Promise<ServiceResponse<number>> => {
  const worker = await prisma.worker.findUnique({
    where: { id: request.id },
    select: {
      teamId: true,
    },
  })

  if (!worker) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '職員'),
  }

  const posts = await prisma.post.findMany({
    where: {
      id: { in: request.posts },
    },
    select: {
      id: true,
      teamId: true,
    },
  })

  if (posts.length !== request.posts.length) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '職位'),
  }

  if (posts.some(p => p.teamId !== worker.teamId)) return {
    isSuccess: false,
    message: '職位不屬於同一團隊',
  }

  return {
    isSuccess: true,
    data: worker.teamId,
  }
}

const saveEntity = async (request: UpdateWorkerPostsRequest): Promise<ServiceResponse> => {
  await prisma.$transaction(async (tx) => {
    const existingPostWorkers = await tx.postWorker.findMany({
      where: { workerId: request.id },
      select: { postId: true },
    })

    const existingPostIdSet = new Set(existingPostWorkers.map(pw => pw.postId))
    const requestPostIdSet = new Set(request.posts)

    const postIdsToCreate: number[] = [];
    const postIdsToDelete: number[] = [];

    for (const postId of existingPostIdSet) {
      if (!requestPostIdSet.has(postId)) {
        postIdsToDelete.push(postId);
      }
    }

    for (const postId of requestPostIdSet) {
      if (!existingPostIdSet.has(postId)) {
        postIdsToCreate.push(postId);
      }
    }

    if (postIdsToCreate.length) {
      await tx.postWorker.createMany({
        data: postIdsToCreate.map(postId => ({
          workerId: request.id,
          postId,
        })),
        skipDuplicates: true,
      })
    }

    if (postIdsToDelete.length) {
      await tx.postWorker.deleteMany({
        where: {
          workerId: request.id,
          postId: { in: postIdsToDelete },
        },
      })
    }
  })

  return {
    isSuccess: true,
  }
}