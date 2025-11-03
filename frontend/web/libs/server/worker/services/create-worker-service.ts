import 'server-only';
import { CreateWorkerRequest, createWorkerRequestSchema } from '../models/create-worker-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { Id } from '../../_general/models/id';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const createWorkerService = tryCatch(async (
  request: CreateWorkerRequest,
): Promise<ServiceResponse<Id>> => {
  const parsedRequest = createWorkerRequestSchema.parse(request);

  const canAccess = await checkCanAccessDepartment(parsedRequest.departmentId);
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '部門'),
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

const execute = async (request: CreateWorkerRequest) =>
  await tryCatchQuery(async () =>
    await prisma.worker.create({
      data: {
        departmentId: request.departmentId,
        name: request.workerName,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse<Id> => {
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