import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { UpdatePostNameRequest, updatePostNameRequestSchema } from '../models/update-post-name-request';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessPost } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const updatePostNameService = tryCatch(async (
  request: UpdatePostNameRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updatePostNameRequestSchema.parse(request);

  const canAccess = await checkCanAccessPost(parsedRequest.id);
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '職位'),
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

const execute = async (request: UpdatePostNameRequest) =>
  await tryCatchQuery(async () =>
    await prisma.post.update({
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
        message: MessageContent.ALREADY_USED.replaceAll('{0}', '職位名稱'),
      }
    }
  }

  throw error;
}