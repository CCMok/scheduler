import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import prisma from '../../_general/managers/database-manager';
import { DeletePostWorkerRequest, deletePostWorkerRequestSchema } from '../models/delete-post-worker-request';

export const deletePostWorkerService = async (request: DeletePostWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deletePostWorkerRequestSchema.parse(request)

    await prisma.postWorker.delete({
      where: {
        postId_workerId: {
          postId: parsedRequest.postId,
          workerId: parsedRequest.workerId,
        },
      },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })