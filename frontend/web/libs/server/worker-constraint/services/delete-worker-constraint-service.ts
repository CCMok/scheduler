import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeleteWorkerConstraintRequest, deleteWorkerConstraintRequestSchema } from '../models/delete-worker-constraint-request';
import prisma from '../../_general/managers/database-manager';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';
import { checkDeptIdAccess } from '../../access/utils/data-access-utils';

export const deleteWorkerConstraintService = async (request: DeleteWorkerConstraintRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deleteWorkerConstraintRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.id);
    if (checkAccessResponse) return checkAccessResponse;

    await execute(parsedRequest)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (id: number): Promise<ServiceResponse | undefined> => {
  const workerConstraint = await prisma.workerConstraint.findUnique({
    where: { id },
  })
  if (!workerConstraint) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '人員條件'),
  }
  const pass = await checkDeptIdAccess(workerConstraint.departmentId);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '部門'),
  }
}

const execute = async (request: DeleteWorkerConstraintRequest): Promise<void> => {
  await prisma.workerConstraint.delete({
    where: { id: request.id },
  })
}