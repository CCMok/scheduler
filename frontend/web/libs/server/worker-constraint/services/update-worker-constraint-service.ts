import 'server-only'
import { UpdateWorkerConstraintRequest, updateWorkerConstraintRequestSchema } from "../models/update-worker-constraint-request";
import prisma from "../../_general/managers/database-manager";
import { ServiceMessage } from "../../../share/_general/enums/service-message";;
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../organization/utils/access-organization-utils';

export const updateWorkerConstraintService = tryCatch(async (
  request: UpdateWorkerConstraintRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updateWorkerConstraintRequestSchema.parse(request)

  const canAccess = await checkAccess(parsedRequest.id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '人員條件'),
  }

  await execute(parsedRequest)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const checkAccess = async (id: number): Promise<boolean> => {
  const workerConstraint = await prisma.workerConstraint.findUnique({
    where: { id },
  })
  if (!workerConstraint) return false
  
  return await checkCanAccessDepartment(workerConstraint.departmentId);
}

const execute = async (request: UpdateWorkerConstraintRequest): Promise<void> => {
  await prisma.workerConstraint.update({
    where: { id: request.id },
    data: {
      workerConstraintTypeId: request.workerConstraintTypeId,
      weighting: request.weighting,
      workerConstraintWorkers: {
        deleteMany: {},
        create: request.workerIds.map(id => ({ workerId: id })),
      }
    },
  })
}