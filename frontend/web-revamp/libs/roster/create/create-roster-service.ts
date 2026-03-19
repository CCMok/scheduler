import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { CreateRosterRequest, createRosterRequestSchema } from './create-roster-request'
import { CreateResponseData, ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessTeam } from '@/libs/auth/authorization/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { Prisma, RosterTimeslot } from '@/external/prisma/generated/client'
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
  return prisma.$transaction(async (tx) => {
    // roster
    const roster = await tx.roster.create({
      data: {
        teamId: request.teamId,
        name: request.name,
      },
    })

    // timeslot
    // request timeslot id -> created timeslot
    const timeslotMap = new Map<number, RosterTimeslot>();

    // keep order
    for (const requestTimeslot of request.timeslots) {
      const createdTimeslot = await tx.rosterTimeslot.create({
        data: {
          rosterId: roster.id,
          name: requestTimeslot.name,
        },
      })
      timeslotMap.set(requestTimeslot.id, createdTimeslot);
    }

    // post
    await Promise.all(request.roster.map((rosterItem) => (
      tx.rosterPost.create({
        data: {
          rosterId: roster.id,
          postId: rosterItem.postId,
          timeslots: {
            create: rosterItem.assignments.map(assignment => ({
              rosterTimeslotId: timeslotMap.get(assignment.timeslotId)?.id ?? 0,
              workerId: isNil(assignment.workerId) ? null : assignment.workerId,
            })),
          },
        },
      })
    )))

    // off
    await Promise.all(request.offs.flatMap(off => off.timeslotIds.map(requestTimeslotId => (
      tx.rosterTimeslotOffWorker.create({
        data: {
          rosterTimeslotId: timeslotMap.get(requestTimeslotId)?.id ?? 0,
          workerId: off.workerId,
        },
      })
    ))))

    return roster.id;
  })
}