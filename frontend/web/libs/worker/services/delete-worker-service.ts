import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessWorker } from '../../access/utils/data-access-utils';
import { MessageContent } from '../../_general/enums/message';

export const deleteWorkerService = tryCatch(async (
  id: number,
): Promise<ServiceResponse> => {
  const canAccess = await checkCanAccessWorker(id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '人員'),
  }

  await execute(id)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (id: number): Promise<void> => {
  await prisma.$transaction([
    prisma.worker.update({
      where: { id },
      data: { isDeleted: true },
    }),
    prisma.postWorker.deleteMany({
      where: { workerId: id },
    }),
    prisma.workerConstraintWorker.deleteMany({
      where: { workerId: id },
    }),
  ])
}