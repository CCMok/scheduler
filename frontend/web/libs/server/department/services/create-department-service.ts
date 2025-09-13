import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { CreateDepartmentRequest, createDepartmentRequestSchema } from '../models/create-department-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { checkOrgIdAccess } from '../../access/utils/data-access-utils';
import { Id } from '../../_general/models/id';
// TODO

export const createDepartmentService = async (request: CreateDepartmentRequest): Promise<ServiceResponse<Id>> =>
  await serviceWrapper(async () => {
    const parsedRequest = createDepartmentRequestSchema.parse(request);

    const checkAccessResponse = await checkAccess(parsedRequest.organizationId);
    if (checkAccessResponse) return checkAccessResponse;

    const executeResponse = await execute(parsedRequest);
    if (!executeResponse.isSuccess) {
      return handleQueryError(executeResponse.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: executeResponse.data.id,
    }
  })

const checkAccess = async (organizationId: number): Promise<ServiceResponse<Id> | undefined> => {
  const pass = await checkOrgIdAccess(organizationId);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '組織'),
  }
}

const execute = async (request: CreateDepartmentRequest) =>
  await tryCatchQuery(async () =>
    await prisma.department.create({
      data: {
        organizationId: request.organizationId,
        name: request.name,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse<Id> => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('name')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: ServiceMessage.ALREADY_USED.replaceAll('{0}', '名稱'),
      }
    }
  }

  throw error;
}