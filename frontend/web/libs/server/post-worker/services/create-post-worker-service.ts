import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { CreatePostWorkerRequest, createPostWorkerRequestSchema } from '../models/create-post-worker-request';
import { getAccessiblePostIdsService, getAccessibleWorkerIdsService } from '../../access/services/data-access-service';

export const createPostWorkerService = async (request: CreatePostWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = createPostWorkerRequestSchema.parse(request);

    const checkAccessResponse = await checkAccess(parsedRequest);
    if (checkAccessResponse) return checkAccessResponse;

    const createResult = await createPostWorker(parsedRequest);
    if (!createResult.isSuccess) {
      return handleQueryError(createResult.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (request: CreatePostWorkerRequest): Promise<ServiceResponse | undefined> => {
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

const createPostWorker = async (request: CreatePostWorkerRequest) =>
  await tryCatchQuery(async () =>
    await prisma.postWorker.create({
      data: {
        postId: request.postId,
        workerId: request.workerId,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('post_id') && target.includes('worker_id')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: ServiceMessage.FOUND.replaceAll('{0}', '職位人員'),
      }
    }
  }

  throw error;
}