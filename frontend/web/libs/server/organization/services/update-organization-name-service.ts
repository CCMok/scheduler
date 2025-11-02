import 'server-only'
import { UpdateOrganizationNameRequest, updateOrganizationNameRequestSchema } from "../models/update-organization-name-request";
import prisma from "../../_general/managers/database-manager";
import { DataBaseQueryResponse } from "../../_general/models/database-query-response";
import { PrismaErrorCode } from "../../_general/enums/prisma-error-code";
import { getPrismaErrorTarget, tryCatchQuery } from "../../_general/utils/database-utils";
import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library";
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessOrganization } from '../utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';
import { tryCatch } from '../../_general/services/try-catch-wrapper';

export const updateOrganizationNameService = tryCatch(async (
  request: UpdateOrganizationNameRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updateOrganizationNameRequestSchema.parse(request)

  const canAccess = await checkCanAccessOrganization(parsedRequest.id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '機構'),
  }

  const executeResponse = await execute(parsedRequest)
  if (!executeResponse.isSuccess) {
    return handleQueryError(executeResponse.error)
  }

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (request: UpdateOrganizationNameRequest): Promise<DataBaseQueryResponse> =>
  await tryCatchQuery(async () =>
    await prisma.organization.update({
      where: { id: request.id },
      data: { name: request.name },
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