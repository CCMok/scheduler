import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { CreatePostWorkerRequest, createPostWorkerRequestSchema } from '../models/create-post-worker-request';
import { MessageContent } from '../../_general/enums/message';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessPost, checkCanAccessWorker } from '../../access/utils/data-access-utils';

export const createPostWorkerService = tryCatch(async (
  request: CreatePostWorkerRequest,
): Promise<ServiceResponse<number>> => {
  const parsedRequest = createPostWorkerRequestSchema.parse(request);

  const canAccessPost = await checkCanAccessPost(parsedRequest.postId);
  if (!canAccessPost) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '職位'),
  }

  const canAccessWorker = await checkCanAccessWorker(parsedRequest.workerId);
  if (!canAccessWorker) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '人員'),
  }

  const executeResponse = await execute(parsedRequest);
  if (!executeResponse.isSuccess) {
    return handleQueryError(executeResponse.error)
  }

  return {
    status: ServiceResponseStatus.OK,
    data: executeResponse.data.id,
  }
})

const execute = async (request: CreatePostWorkerRequest) =>
  await tryCatchQuery(async () =>
    await prisma.postWorker.create({
      data: {
        postId: request.postId,
        workerId: request.workerId,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse<number> => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('post_id') && target.includes('worker_id')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: MessageContent.FOUND.replaceAll('{0}', '職位人員'),
      }
    }
  }

  throw error;
}