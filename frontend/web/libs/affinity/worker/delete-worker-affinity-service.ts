import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import {
  DeleteWorkerAffinityRequest,
  deleteWorkerAffinityRequestSchema,
} from './delete-worker-affinity-request'

export const deleteWorkerAffinity = tryCatch(async (
  request: DeleteWorkerAffinityRequest,
): Promise<ServiceResponse> => {
  const parsed = deleteWorkerAffinityRequestSchema.parse(request)

  const affinity = await prisma.workerAffinity.findUnique({
    where: { id: parsed.id },
    select: { id: true, teamId: true },
  })
  if (!affinity) {
    return { isSuccess: false, message: Message.NOT_FOUND.replaceAll('{0}', '職員同班組') }
  }

  const canAccess = await checkCanAccessTeam(affinity.teamId)
  if (!canAccess) return { isSuccess: false, message: Message.UNAUTHORIZED }

  await prisma.workerAffinity.delete({ where: { id: parsed.id } })

  return { isSuccess: true }
})
