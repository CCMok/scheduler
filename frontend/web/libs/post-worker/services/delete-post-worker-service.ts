import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { DeletePostWorkerRequest, deletePostWorkerRequestSchema } from '../models/delete-post-worker-request';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessPost, checkCanAccessWorker } from '../../access/utils/data-access-utils';
import { MessageContent } from '../../_general/enums/message';

export const deletePostWorkerService = tryCatch(async (
  request: DeletePostWorkerRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = deletePostWorkerRequestSchema.parse(request)

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

  await execute(parsedRequest);

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (request: DeletePostWorkerRequest): Promise<void> => {
  await prisma.postWorker.delete({
    where: {
      postId_workerId: {
        postId: request.postId,
        workerId: request.workerId,
      },
    },
  })
}