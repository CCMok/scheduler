import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeleteWorkerRequest, deleteWorkerRequestSchema } from '../models/delete-worker-request';
import prisma from '../../_general/managers/database-manager';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';
import { checkWorkerIdAccess } from '../../access/utils/data-access-utils';

export const deleteWorkerService = async (request: DeleteWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deleteWorkerRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.workerId);
    if (checkAccessResponse) return checkAccessResponse;

    await execute(parsedRequest)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (workerId: number): Promise<ServiceResponse | undefined> => {
  const pass = await checkWorkerIdAccess(workerId);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '人員'),
  }
}

const execute = async (request: DeleteWorkerRequest): Promise<void> => {
  await prisma.$transaction([
    prisma.worker.update({
      where: { id: request.workerId },
      data: { isDeleted: true },
    }),
    prisma.postWorker.deleteMany({
      where: { workerId: request.workerId },
    }),
    prisma.workerConstraintWorker.deleteMany({
      where: { workerId: request.workerId },
    }),
  ])
}