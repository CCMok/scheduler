import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { UpdateTeamNameRequest, updateTeamNameRequestSchema } from './update-team-name-request'
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { handlePersistError } from '@/libs/_general/database/database-utils'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'

export const updateTeamName = tryCatch(async (request: UpdateTeamNameRequest): Promise<ServiceResponse> => {
  const parsedRequest = updateTeamNameRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const team = await getTeam(parsedRequest.id)
  if (!team) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '團隊'),
  }

  if (team.name === parsedRequest.name) return {
    isSuccess: false,
    message: '名稱沒有更改',
  }

  await saveEntity(parsedRequest.id, parsedRequest.name);

  return {
    isSuccess: true,
  }
})

const getTeam = async (id: number) => {
  return await prisma.team.findUnique({
    where: { id },
  })
}

const saveEntity = async (id: number, name: string): Promise<ServiceResponse> => {
  try {
    await prisma.team.update({
      where: { id },
      data: { name },
    })
  } catch (e) {
    return handlePersistError(e, new Map([
      [PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION, () => ({
        isSuccess: false,
        message: Message.ALREADY_USED.replaceAll('{0}', '名稱'),
      })],
    ]))
  }

  return {
    isSuccess: true,
  }
}