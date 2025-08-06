import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeleteWorkerRequest, deleteWorkerRequestSchema } from '../models/delete-worker-request';
import prisma from '../../_general/managers/database-manager';

export const deleteWorkerService = async (request: DeleteWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deleteWorkerRequestSchema.parse(request)

    await prisma.worker.delete({
      where: { id: parsedRequest.workerId },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })