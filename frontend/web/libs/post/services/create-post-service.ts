import 'server-only';
import { CreatePostRequest, createPostRequestSchema } from '../models/create-post-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../access/utils/data-access-utils';
import { MessageContent } from '../../_general/enums/message';

export const createPostService = tryCatch(async (
  request: CreatePostRequest,
): Promise<ServiceResponse<number>> => {
  const parsedRequest = createPostRequestSchema.parse(request)

  const canAccess = await checkCanAccessDepartment(parsedRequest.departmentId)
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

const execute = async (request: CreatePostRequest) =>
  await tryCatchQuery(async () =>
    await prisma.post.create({
      data: {
        departmentId: request.departmentId,
        name: request.postName,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse<number> => {
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