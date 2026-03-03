import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { CreateRosterRequest, createRosterRequestSchema } from './create-roster-request'
import { CreateResponseData, ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessTeam } from '@/libs/auth/authorization/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { Post, Prisma, Worker } from '@/external/prisma/generated/client'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'

export const createRoster = tryCatch(async (request: CreateRosterRequest): Promise<ServiceResponse<CreateResponseData>> => {
  const parsedRequest = createRosterRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const postMap = await getPostMap(parsedRequest.teamId)
  const workerMap = await getWorkerMap(parsedRequest.teamId)

  let id: number;
  try {
    id = await saveEntity(parsedRequest, postMap, workerMap)
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

const getPostMap = async (teamId: number): Promise<Map<number, Post>> => {
  const posts = await prisma.post.findMany({
    where: { teamId },
  })
  return new Map(posts.map(post => [post.id, post]))
}

const getWorkerMap = async (teamId: number): Promise<Map<number, Worker>> => {
  const workers = await prisma.worker.findMany({
    where: { teamId },
  })
  return new Map(workers.map(worker => [worker.id, worker]))
}

export const saveEntity = async (
  request: CreateRosterRequest,
  postMap: Map<number, Post>,
  workerMap: Map<number, Worker>,
): Promise<number> => {
  const entity = await prisma.roster.create({
    data: {
      teamId: request.teamId,
      name: request.name,
      timeslots: {
        create: request.rosterDto.map(rosterTimeslot => ({
          timeslot: rosterTimeslot.timeslot,
          assignments: {
            create: rosterTimeslot.assignments.map(assignment => ({
              postId: assignment.postId,
              workerId: assignment.workerId,
              fallbackPostName: postMap.get(assignment.postId)?.name ?? '',
              fallbackWorkerName: assignment.workerId
                ? (workerMap.get(assignment.workerId)?.name ?? '')
                : undefined,
            })),
          },
          // TODO: add roster off timeslot
        }))
      },
      // TODO
      // rosterOffWorkers: {
      //   create: request.offs.map(off => ({
      //     workerId: off.workerId,
      //     fallbackWorkerName: workerMap.get(off.workerId)?.name ?? '',
      //     rosterOffWorkerTimeslot: {
      //       create: off.timeslots.map(timeslot => ({
      //         timeslot,
      //       })),
      //     },
      //   })),
      // },
    }
  })
  return entity.id
}