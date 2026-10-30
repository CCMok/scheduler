import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import {
  UpdateTeamMaxAssignRequest,
  updateTeamMaxAssignRequestSchema,
} from './update-team-max-assign-request'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'

export const updateTeamMaxAssign = tryCatch(async (
  request: UpdateTeamMaxAssignRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updateTeamMaxAssignRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const team = await prisma.team.findUnique({
    where: { id: parsedRequest.id },
    select: { id: true, maxWorkerAssignPerRoster: true },
  })
  if (!team) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '團隊'),
  }

  if (team.maxWorkerAssignPerRoster === parsedRequest.maxWorkerAssignPerRoster) {
    return {
      isSuccess: false,
      message: `每表上限${Message.NOT_CHANGE}`,
    }
  }

  await prisma.team.update({
    where: { id: parsedRequest.id },
    data: { maxWorkerAssignPerRoster: parsedRequest.maxWorkerAssignPerRoster },
  })

  return { isSuccess: true }
})
