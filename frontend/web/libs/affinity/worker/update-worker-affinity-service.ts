import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import {
  UpdateWorkerAffinityRequest,
  updateWorkerAffinityRequestSchema,
} from './update-worker-affinity-request'

export const updateWorkerAffinity = tryCatch(async (
  request: UpdateWorkerAffinityRequest,
): Promise<ServiceResponse> => {
  const parsed = updateWorkerAffinityRequestSchema.parse(request)
  const workerIds = [...new Set(parsed.workerIds)]

  if (workerIds.length < 2) {
    return { isSuccess: false, message: '至少選擇兩位職員' }
  }

  const affinity = await prisma.workerAffinity.findUnique({
    where: { id: parsed.id },
    select: { id: true, teamId: true },
  })
  if (!affinity) {
    return { isSuccess: false, message: Message.NOT_FOUND.replaceAll('{0}', '職員同班組') }
  }

  const canAccess = await checkCanAccessTeam(affinity.teamId)
  if (!canAccess) return { isSuccess: false, message: Message.UNAUTHORIZED }

  const workers = await prisma.worker.findMany({
    where: { id: { in: workerIds } },
    select: { id: true, teamId: true },
  })
  if (workers.length !== workerIds.length) {
    return { isSuccess: false, message: Message.NOT_FOUND.replaceAll('{0}', '職員') }
  }
  if (workers.some((w) => w.teamId !== affinity.teamId)) {
    return { isSuccess: false, message: '職員不屬於同一團隊' }
  }

  await prisma.$transaction(async (tx) => {
    await tx.workerAffinityMember.deleteMany({ where: { workerAffinityId: parsed.id } })
    await tx.workerAffinityMember.createMany({
      data: workerIds.map((workerId) => ({
        workerAffinityId: parsed.id,
        workerId,
      })),
    })
  })

  return { isSuccess: true }
})
