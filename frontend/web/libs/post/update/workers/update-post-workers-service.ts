import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { UpdatePostWorkersRequest, updatePostWorkersRequestSchema } from './update-post-workers-request'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'

export const updatePostWorkers = tryCatch(async (request: UpdatePostWorkersRequest): Promise<ServiceResponse> => {
  const parsedRequest = updatePostWorkersRequestSchema.parse(request)

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

const getTeamId = async (request: UpdatePostWorkersRequest): Promise<ServiceResponse<number>> => {
  const post = await prisma.post.findUnique({
    where: { id: request.id },
    select: {
      teamId: true,
    },
  })

  if (!post) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '職位'),
  }

  const workers = await prisma.worker.findMany({
    where: {
      id: { in: request.workers },
    },
    select: {
      id: true,
      teamId: true,
    },
  })

  if (workers.length !== request.workers.length) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '職員'),
  }

  if (workers.some(w => w.teamId !== post.teamId)) return {
    isSuccess: false,
    message: '職員不屬於同一團隊',
  }

  return {
    isSuccess: true,
    data: post.teamId,
  }
}

const saveEntity = async (request: UpdatePostWorkersRequest): Promise<ServiceResponse> => {
  await prisma.$transaction(async (tx) => {
    const existingPostWorkers = await tx.postWorker.findMany({
      where: { postId: request.id },
      select: { workerId: true },
    })

    const existingWorkerIdSet = new Set(existingPostWorkers.map(pw => pw.workerId))
    const requestWorkerIdSet = new Set(request.workers)

    const workerIdsToCreate: number[] = [];
    const workerIdsToDelete: number[] = [];

    for (const workerId of existingWorkerIdSet) {
      if (!requestWorkerIdSet.has(workerId)) {
        workerIdsToDelete.push(workerId);
      }
    }

    for (const workerId of requestWorkerIdSet) {
      if (!existingWorkerIdSet.has(workerId)) {
        workerIdsToCreate.push(workerId);
      }
    }

    if (workerIdsToCreate.length) {
      await tx.postWorker.createMany({
        data: workerIdsToCreate.map(workerId => ({
          postId: request.id,
          workerId,
        })),
        skipDuplicates: true,
      })
    }

    if (workerIdsToDelete.length) {
      await tx.postWorker.deleteMany({
        where: {
          postId: request.id,
          workerId: { in: workerIdsToDelete },
        },
      })
    }
  })

  return {
    isSuccess: true,
  }
}