import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { UpdateOrganizationNameRequest, updateOrganizationNameRequestSchema } from "../models/update-organization-name-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import prisma from "../../_general/managers/database-manager";
import { ServerMessage } from "../../_general/enums/server-message";
import { DataBaseQueryResponse } from "../../_general/models/database-query-response";
import { PrismaErrorCode } from "../../_general/enums/prisma-error-code";
import { tryCatchQuery } from "../../_general/utils/database-utils";

export const updateOrganizationName = async (request: UpdateOrganizationNameRequest): Promise<ServerResponse> => {
  const parsedRequest = updateOrganizationNameRequestSchema.parse(request)

  const isValidOrganizationId = await checkOrganizationId(parsedRequest.id)
  if (!isValidOrganizationId) return {
    status: ServerResponseStatus.BAD_REQUEST,
    message: ServerMessage.NOT_FOUND.replaceAll('{0}', '組織')
  }

  const updateResult = await updateName(parsedRequest)
  if (!updateResult.isSuccess) {
    if (updateResult.error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
      return {
        status: ServerResponseStatus.BAD_REQUEST,
        message: ServerMessage.ALREADY_USED.replaceAll('{0}', '名稱'),
      }
    }

    throw updateResult.error;
  }

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}

const checkOrganizationId = async (organizationId: number): Promise<boolean> => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  })

  return Boolean(organization)
}

const updateName = async (request: UpdateOrganizationNameRequest): Promise<DataBaseQueryResponse> =>
  await tryCatchQuery(async () =>
    await prisma.organization.update({
      where: { id: request.id },
      data: { name: request.name },
    })
  )

