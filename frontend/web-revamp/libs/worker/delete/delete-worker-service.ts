import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessWorker } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { handlePersistError } from '@/libs/_general/database/database-utils'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'

export const deleteWorker = tryCatch(async (id: number): Promise<ServiceResponse> => {
  const canAccess = await checkCanAccessWorker(id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  return await deleteEntity(id)
})

const deleteEntity = async (id: number): Promise<ServiceResponse> => {
  try {
    await prisma.$transaction([
      prisma.worker.delete({
        where: { id },
      }),
      prisma.rosterTimeslotAssignment.updateMany({
        where: { workerId: id },
        data: { workerId: null },
      }),
      prisma.rosterTimeslotOffWorker.deleteMany({
        where: { workerId: id },
      }),
    ])
  } catch (e) {
    return handlePersistError(e, new Map([
      [PrismaErrorCode.NOT_FOUND, () => ({
        isSuccess: false,
        message: Message.NOT_FOUND.replaceAll('{0}', '職員'),
      })],
    ]))
  }

  return {
    isSuccess: true,
  }
}