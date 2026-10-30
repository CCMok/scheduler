import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import {
  CreateWorkerAffinityRequest,
  createWorkerAffinityRequestSchema,
} from './create-worker-affinity-request'

export const createWorkerAffinity = tryCatch(async (
  request: CreateWorkerAffinityRequest,
): Promise<ServiceResponse<{ id: number }>> => {
  const parsed = createWorkerAffinityRequestSchema.parse(request)
  const workerIds = [...new Set(parsed.workerIds)]

  if (workerIds.length < 2) {
    return { isSuccess: false, message: '至少選擇兩位職員' }
  }

  const canAccess = await checkCanAccessTeam(parsed.teamId)
  if (!canAccess) return { isSuccess: false, message: Message.UNAUTHORIZED }

  const workers = await prisma.worker.findMany({
    where: { id: { in: workerIds } },
    select: { id: true, teamId: true },
  })
  if (workers.length !== workerIds.length) {
    return { isSuccess: false, message: Message.NOT_FOUND.replaceAll('{0}', '職員') }
  }
  if (workers.some((w) => w.teamId !== parsed.teamId)) {
    return { isSuccess: false, message: '職員不屬於同一團隊' }
  }

  const created = await prisma.workerAffinity.create({
    data: {
      teamId: parsed.teamId,
      members: {
        create: workerIds.map((workerId) => ({ workerId })),
      },
    },
    select: { id: true },
  })

  return { isSuccess: true, data: created }
})
