import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { AddWorkerRequest, addWorkerRequestSchema } from '../models/add-worker-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';

export const addWorker = async (request: AddWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = addWorkerRequestSchema.parse(request);

    const createResult = await createWorker(parsedRequest);
    if (!createResult.isSuccess) {
      return handleQueryError(createResult.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const createWorker = async (request: AddWorkerRequest) =>
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