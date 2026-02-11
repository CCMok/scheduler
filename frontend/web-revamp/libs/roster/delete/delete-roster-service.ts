import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessRoster } from '@/libs/auth/authorization/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'

export const deleteRoster = tryCatch(async (id: number): Promise<ServiceResponse> => {
  const canAccess = await checkCanAccessRoster(id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  await prisma.roster.delete({
    where: { id },
  })

  return {
    isSuccess: true,
  }
})