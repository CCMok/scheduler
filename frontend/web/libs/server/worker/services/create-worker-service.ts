import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { CreateWorkerRequest, createWorkerRequestSchema } from '../models/create-worker-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { getAccessibleDepartmentIdsService } from '../../access/services/access-service';

export const createWorkerService = async (request: CreateWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = createWorkerRequestSchema.parse(request);

    const checkAccessResponse = await checkAccess(parsedRequest.departmentId);
    if (checkAccessResponse) return checkAccessResponse;

    const createResult = await createWorker(parsedRequest);
    if (!createResult.isSuccess) {
      return handleQueryError(createResult.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (departmentId: number): Promise<ServiceResponse | undefined> => {
  const accessServiceResponse = await getAccessibleDepartmentIdsService();

  if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

  if (accessServiceResponse.data.canAccessAll || accessServiceResponse.data.ids.includes(departmentId)) return;

  return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '部門'),
  }
}

const createWorker = async (request: CreateWorkerRequest) =>
  await tryCatchQuery(async () =>
    await prisma.worker.create({
      data: {
        departmentId: request.departmentId,
        name: request.workerName,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('name')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: ServiceMessage.ALREADY_USED.replaceAll('{0}', '人員名稱'),
      }
    }
  }

  throw error;
}