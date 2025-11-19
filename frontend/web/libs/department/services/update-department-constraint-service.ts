import 'server-only'
import { UpdateDepartmentNameRequest } from "../models/update-department-name-request";
import prisma from "../../_general/managers/database-manager";
import { DataBaseQueryResponse } from "../../_general/models/database-query-response";
import { PrismaErrorCode } from "../../_general/enums/prisma-error-code";
import { getPrismaErrorTarget, tryCatchQuery } from "../../_general/utils/database-utils";
import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library";
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../access/utils/data-access-utils';
import { MessageContent } from '../../_general/enums/message';
import { UpdateDepartmentConstraintRequest, updateDepartmentConstraintRequestSchema } from '../models/update-department-constraint-request';

export const updateDepartmentConstraintService = tryCatch(async (
  request: UpdateDepartmentConstraintRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updateDepartmentConstraintRequestSchema.parse(request)

  const canAccess = await checkCanAccessDepartment(parsedRequest.id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '部門'),
  }

  await execute(parsedRequest)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (request: UpdateDepartmentConstraintRequest) =>
  await prisma.department.update({
    where: { id: request.id },
    data: { maxWorkerPostPerRoster: request.maxWorkerPostPerRoster ?? null },
  })