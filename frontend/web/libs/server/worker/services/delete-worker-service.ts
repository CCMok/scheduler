import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeleteWorkerRequest, deleteWorkerRequestSchema } from '../models/delete-worker-request';
import prisma from '../../_general/managers/database-manager';
import { getAccessibleWorkerIdsService } from '../../access/services/data-access-service';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';

export const deleteWorkerService = async (request: DeleteWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deleteWorkerRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.workerId);
    if (checkAccessResponse) return checkAccessResponse;

    await prisma.worker.update({
      where: { id: parsedRequest.workerId },
      data: { isDeleted: true },
    })

    await prisma.postWorker.deleteMany({
      where: { workerId: parsedRequest.workerId },
    })

    await prisma.workerConstraintWorker.deleteMany({
      where: { workerId: parsedRequest.workerId },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (workerId: number): Promise<ServiceResponse | undefined> => {
  const accessServiceResponse = await getAccessibleWorkerIdsService();

  if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

  if (accessServiceResponse.data.canAccessAll || accessServiceResponse.data.ids.includes(workerId)) return;

  return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '人員'),
  }
}