import 'server-only'
import { UpdateDepartmentNameRequest, updateDepartmentNameRequestSchema } from "../models/update-department-name-request";
import prisma from "../../_general/managers/database-manager";
import { DataBaseQueryResponse } from "../../_general/models/database-query-response";
import { PrismaErrorCode } from "../../_general/enums/prisma-error-code";
import { getPrismaErrorTarget, tryCatchQuery } from "../../_general/utils/database-utils";
import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library";
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../access/utils/data-access-utils';
import { MessageContent } from '../../_general/enums/message';

export const updateDepartmentNameService = tryCatch(async (
  request: UpdateDepartmentNameRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updateDepartmentNameRequestSchema.parse(request)

  const canAccess = await checkCanAccessDepartment(parsedRequest.id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '部門'),
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

const execute = async (request: UpdateDepartmentNameRequest): Promise<DataBaseQueryResponse> =>
  await tryCatchQuery(async () =>
    await prisma.department.update({
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