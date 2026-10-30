import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import {
  DeletePostAffinityRequest,
  deletePostAffinityRequestSchema,
} from './delete-post-affinity-request'

export const deletePostAffinity = tryCatch(async (
  request: DeletePostAffinityRequest,
): Promise<ServiceResponse> => {
  const parsed = deletePostAffinityRequestSchema.parse(request)

  const affinity = await prisma.postAffinity.findUnique({
    where: { id: parsed.id },
    select: { id: true, teamId: true },
  })
  if (!affinity) {
    return { isSuccess: false, message: Message.NOT_FOUND.replaceAll('{0}', '職位搭配組') }
  }

  const canAccess = await checkCanAccessTeam(affinity.teamId)
  if (!canAccess) return { isSuccess: false, message: Message.UNAUTHORIZED }

  await prisma.postAffinity.delete({ where: { id: parsed.id } })

  return { isSuccess: true }
})
