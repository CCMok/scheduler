import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { CreateUserOrganizationRequest, createUserOrganizationRequestSchema } from '../models/create-user-organization-request';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessOrganization } from '../../access/utils/data-access-utils';
import { MessageContent } from '../../_general/enums/message';

export const createUserOrganizationService = tryCatch(async (
  request: CreateUserOrganizationRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = createUserOrganizationRequestSchema.parse(request);

  const canAccess = await checkCanAccessOrganization(parsedRequest.organizationId)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '機構'),
  };

  const executeResponse = await execute(parsedRequest);
  if (!executeResponse.isSuccess) {
    return handleQueryError(executeResponse.error)
  }

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (request: CreateUserOrganizationRequest) =>
  await tryCatchQuery(async () =>
    await prisma.userOrganization.create({
      data: {
        userId: request.userId,
        organizationId: request.organizationId,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('user_id') && target.includes('organization_id')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: MessageContent.FOUND.replaceAll('{0}', '用戶機構'),
      }
    }
  }

  throw error;
}