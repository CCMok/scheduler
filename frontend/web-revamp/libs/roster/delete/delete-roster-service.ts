import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessRoster } from '@/libs/auth/authorization/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { Prisma } from '@/external/prisma/generated/client'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'

export const deleteRoster = tryCatch(async (id: number): Promise<ServiceResponse> => {
  const canAccess = await checkCanAccessRoster(id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  try {
    await prisma.roster.delete({
      where: { id },
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === PrismaErrorCode.NOT_FOUND) {
      return {
        isSuccess: false,
        message: Message.NOT_FOUND.replaceAll('{0}', '值班表'),
      }
    }

    console.error('Failed to delete roster')
    console.error(e)
    return {
      isSuccess: false,
      message: Message.SYSTEM_ERROR,
    };
  }

  return {
    isSuccess: true,
  }
})