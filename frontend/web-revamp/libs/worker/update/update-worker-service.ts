import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { checkCanAccessWorker } from '@/libs/auth/general/access-utils'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { handlePersistError } from '@/libs/_general/database/database-utils'
import { PrismaErrorCode } from '@/libs/_general/database/prisma-error-code'
import { UpdateWorkerRequest, updateWorkerRequestSchema } from './update-worker-request'

export const updateWorker = tryCatch(async (request: UpdateWorkerRequest): Promise<ServiceResponse> => {
  const parsedRequest = updateWorkerRequestSchema.parse(request)

  const canAccess = await checkCanAccessWorker(parsedRequest.id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const worker = await getWorker(parsedRequest.id)
  if (!worker) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '職員'),
  }

  if (worker.name === parsedRequest.name) return {
    isSuccess: false,
    message: '名稱沒有更改',
  }

  return await saveEntity(parsedRequest);
})

const getWorker = async (id: number) => {
  return await prisma.worker.findUnique({
    where: { id },
  })
}

const saveEntity = async (request: UpdateWorkerRequest): Promise<ServiceResponse> => {
  try {
    await prisma.worker.update({
      where: { id: request.id },
      data: { name: request.name },
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