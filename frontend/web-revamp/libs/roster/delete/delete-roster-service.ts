import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessRoster } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { handlePersistError } from '@/libs/_general/database/database-utils'

export const deleteRoster = tryCatch(async (id: number): Promise<ServiceResponse> => {
  const canAccess = await checkCanAccessRoster(id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const deleteResult = await deleteEntity(id)
  if (!deleteResult.isSuccess) return deleteResult

  return {
    isSuccess: true,
  }
})

const deleteEntity = async (id: number): Promise<ServiceResponse> => {
  try {
    await prisma.roster.delete({
      where: { id },
    })
  } catch (e) {
    return handlePersistError(e, new Map([
      [PrismaErrorCode.NOT_FOUND, () => ({
        isSuccess: false,
        message: Message.NOT_FOUND.replaceAll('{0}', '值班表'),
      })],
    ]))
  }

  return {
    isSuccess: true,
  }
}