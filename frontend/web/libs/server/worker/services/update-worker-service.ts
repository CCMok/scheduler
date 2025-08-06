import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { UpdateWorkerRequest, updateWorkerRequestSchema } from '../models/update-worker-request';

export const updateWorker = async (request: UpdateWorkerRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = updateWorkerRequestSchema.parse(request);

    const updateResult = await updateWorkerInDb(parsedRequest);
    if (!updateResult.isSuccess) {
      return handleQueryError(updateResult.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const updateWorkerInDb = async (request: UpdateWorkerRequest) =>
  await tryCatchQuery(async () =>
    await prisma.worker.update({
      where: { id: request.workerId },
      data: {
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
        message: ServiceMessage.ALREADY_USED.replaceAll('{0}', '職位名稱'),
      }
    }
  }

  throw error;
}