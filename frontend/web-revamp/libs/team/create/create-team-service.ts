import { Prisma } from '@/external/prisma/generated/client'
import prisma from '@/libs/_general/database/database-manager'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { getSession } from '@/libs/_general/session/session-manager'
import { Message } from '@/libs/_general/service/message'
import { ServiceResponse } from '@/libs/_general/service/response'
import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { CreateTeamRequest, createTeamRequestSchema } from './create-team-request'

export const createTeam = tryCatch(async (request: CreateTeamRequest): Promise<ServiceResponse<number>> => {
  const parsedRequest = createTeamRequestSchema.parse(request)

  const session = await getSession()
  if (!session) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const duplicatedPostName = getDuplicatedName(parsedRequest.posts.map(post => post.name))
  if (duplicatedPostName) return {
    isSuccess: false,
    message: `職位名稱「${duplicatedPostName}」重複`,
  }

  const duplicatedWorkerName = getDuplicatedName(parsedRequest.workers.map(worker => worker.name))
  if (duplicatedWorkerName) return {
    isSuccess: false,
    message: `職員名稱「${duplicatedWorkerName}」重複`,
  }

  const hasInvalidPostIndex = parsedRequest.workers.some(worker =>
    worker.posts.some(postIndex => postIndex >= parsedRequest.posts.length)
  )
  if (hasInvalidPostIndex) return {
    isSuccess: false,
    message: '職員職位設定不正確',
  }

  return await saveEntity(session.userId, parsedRequest)
})

const getDuplicatedName = (names: string[]): string | undefined => {
  const seenNames = new Set<string>()

  for (const name of names) {
    const normalizedName = name.trim()
    if (seenNames.has(normalizedName)) return normalizedName
    seenNames.add(normalizedName)
  }
}

const saveEntity = async (ownerId: number, request: CreateTeamRequest): Promise<ServiceResponse<number>> => {
  let createdId: number;
  try {
    const createdTeam = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          ownerId,
          name: request.name.trim(),
        },
      })

      const posts = await Promise.all(request.posts.map((post, index) =>
        tx.post.create({
          data: {
            teamId: team.id,
            name: post.name.trim(),
            displayOrder: index,
          },
        })
      ))

      const workers = await Promise.all(request.workers.map(worker =>
        tx.worker.create({
          data: {
            teamId: team.id,
            name: worker.name.trim(),
          },
        })
      ))

      const postWorkers = request.workers.flatMap((worker, workerIndex) =>
        worker.posts.map(postIndex => ({
          postId: posts[postIndex].id,
          workerId: workers[workerIndex].id,
        }))
      )

      if (postWorkers.length > 0) {
        await tx.postWorker.createMany({
          data: postWorkers,
        })
      }

      return team
    })
    createdId = createdTeam.id
  } catch (e) {
    return handleCreateTeamPersistError(e)
  }

  return {
    isSuccess: true,
    data: createdId,
  }
}

const handleCreateTeamPersistError = (error: unknown): ServiceResponse<number> => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return {
    isSuccess: false,
    message: Message.SYSTEM_ERROR,
  }

  if (error.code !== PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) return {
    isSuccess: false,
    message: Message.SYSTEM_ERROR,
  }

  const modelName = typeof error.meta?.modelName === 'string' ? error.meta.modelName : undefined
  if (modelName === 'Post') return {
    isSuccess: false,
    message: Message.ALREADY_USED.replaceAll('{0}', '職位名稱'),
  }
  if (modelName === 'Worker') return {
    isSuccess: false,
    message: Message.ALREADY_USED.replaceAll('{0}', '職員名稱'),
  }

  return {
    isSuccess: false,
    message: Message.ALREADY_USED.replaceAll('{0}', '團隊名稱'),
  }
}