import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import prisma from '../../_general/managers/database-manager';
import { DeletePostWorkerRequest, deletePostWorkerRequestSchema } from '../models/delete-post-worker-request';
import { getAccessiblePostIdsService, getAccessibleWorkerIdsService } from '../../access/services/data-access-service';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';

export const deletePostWorkerService = async (request: DeletePostWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deletePostWorkerRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest);
    if (checkAccessResponse) return checkAccessResponse;

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

  const checkAccess = async (request: DeletePostWorkerRequest): Promise<ServiceResponse | undefined> => {
    const postAccessResponse = await checkPostAccess(request.postId);
    if (postAccessResponse) return postAccessResponse;
    
    const workerAccessResponse = await checkWorkerAccess(request.workerId);
    if (workerAccessResponse) return workerAccessResponse;
  }
  
  const checkWorkerAccess = async (workerId: number): Promise<ServiceResponse | undefined> => {
    const accessServiceResponse = await getAccessibleWorkerIdsService();
  
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;
  
    if (accessServiceResponse.data.canAccessAll || accessServiceResponse.data.ids.includes(workerId)) return;
  
    return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '人員'),
    }
  }
  
  const checkPostAccess = async (postId: number): Promise<ServiceResponse | undefined> => {
    const accessServiceResponse = await getAccessiblePostIdsService();
  
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;
  
    if (accessServiceResponse.data.canAccessAll || accessServiceResponse.data.ids.includes(postId)) return;
  
    return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位'),
    }
  }