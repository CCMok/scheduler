import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { CreateUserOrganizationRequest, createUserOrganizationRequestSchema } from '../models/create-user-organization-request';
import { checkOrgIdAccess } from '../../access/utils/data-access-utils';

export const createUserOrganizationService = async (request: CreateUserOrganizationRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = createUserOrganizationRequestSchema.parse(request);

    const canAccess = await checkOrgIdAccess(parsedRequest.organizationId)
    if (!canAccess) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '機構'),
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
        message: ServiceMessage.FOUND.replaceAll('{0}', '用戶機構'),
      }
    }
  }

  throw error;
}