import { tryCatch } from '@/libs/_general/service/try-catch'
import 'server-only'
import { ServiceResponse } from '@/libs/_general/service/response'
import { Message } from '@/libs/_general/service/message'
import prisma from '@/libs/_general/database/database-manager'
import { checkCanAccessWorker } from '@/libs/auth/general/access-utils'
import { UpdateWorkerStatusRequest, updateWorkerStatusRequestSchema } from './update-worker-status-request'

export const updateWorkerStatus = tryCatch(async (request: UpdateWorkerStatusRequest): Promise<ServiceResponse> => {
  const parsedRequest = updateWorkerStatusRequestSchema.parse(request)
  
  const canAccess = await checkCanAccessWorker(parsedRequest.id)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const originalValue = await getOriginalValue(parsedRequest.id);
  if (originalValue === undefined) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '職員'),
  }

  if (originalValue === parsedRequest.status) return {
    isSuccess: false,
    message: `狀態${Message.NOT_CHANGE}`,
  }

  await saveEntity(parsedRequest);

  return {
    isSuccess: true,
  }
})

const getOriginalValue = async (id: number): Promise<number | undefined> => {
  const worker = await prisma.worker.findUnique({
    where: { id },
    select: { status: true },
  })
  return worker?.status ?? undefined;
} 

const saveEntity = async (request: UpdateWorkerStatusRequest): Promise<void> => {
  await prisma.worker.update({
    where: { id: request.id },
    data: { status: request.status },
  })
}