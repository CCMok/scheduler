import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { UpdateWorkerNameRequest, updateWorkerNameRequestSchema } from '../models/update-worker-name-request';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { checkCanAccessWorker } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const updateWorkerNameService = tryCatch(async (
  request: UpdateWorkerNameRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updateWorkerNameRequestSchema.parse(request);

  const canAccess = await checkCanAccessWorker(parsedRequest.id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '人員'),
  }

  const executeResponse = await execute(parsedRequest);
  if (!executeResponse.isSuccess) {
    return handleQueryError(executeResponse.error)
  }

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (request: UpdateWorkerNameRequest) =>
  await tryCatchQuery(async () =>
    await prisma.worker.update({
      where: { id: request.id },
      data: {
        name: request.name,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('name')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: MessageContent.ALREADY_USED.replaceAll('{0}', '名稱'),
      }
    }
  }

  throw error;
}