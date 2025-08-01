import 'server-only'
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { UpdateOrganizationNameRequest, updateOrganizationNameRequestSchema } from "../models/update-organization-name-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import prisma from "../../_general/managers/database-manager";
import { ServerMessage } from "../../_general/enums/server-message";
import { DataBaseQueryResponse } from "../../_general/models/database-query-response";
import { PrismaErrorCode } from "../../_general/enums/prisma-error-code";
import { getPrismaErrorTarget, tryCatchQuery } from "../../_general/utils/database-utils";
import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library";
import { serviceWrapper } from '../../_general/services/general-service';

export const updateOrganizationName = async (request: UpdateOrganizationNameRequest): Promise<ServerResponse> =>
  await serviceWrapper<{}>(async () => {
    const parsedRequest = updateOrganizationNameRequestSchema.parse(request)

    const updateResult = await updateName(parsedRequest)
    if (!updateResult.isSuccess) {
      return handleQueryError(updateResult.error)
    }

    return {
      status: ServerResponseStatus.OK,
      data: {},
    }
  })

const updateName = async (request: UpdateOrganizationNameRequest): Promise<DataBaseQueryResponse> =>
  await tryCatchQuery(async () =>
    await prisma.organization.update({
      where: { id: request.id },
      data: { name: request.name },
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServerResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('email')) {
      return {
        status: ServerResponseStatus.BAD_REQUEST,
        message: ServerMessage.ALREADY_USED.replaceAll('{0}', '電郵地址'),
      }
    }
  }

  throw error;
}