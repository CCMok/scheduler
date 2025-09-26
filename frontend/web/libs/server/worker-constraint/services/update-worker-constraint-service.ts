import 'server-only'
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { UpdateWorkerConstraintRequest, updateWorkerConstraintRequestSchema } from "../models/update-worker-constraint-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { ServiceMessage } from "../../../share/_general/enums/service-message";;
import { serviceWrapper } from '../../_general/services/general-service';
import { checkDeptIdAccess } from '../../access/utils/data-access-utils';

export const updateWorkerConstraintService = async (request: UpdateWorkerConstraintRequest): Promise<ServiceResponse> =>
  await serviceWrapper<{}>(async () => {
    const parsedRequest = updateWorkerConstraintRequestSchema.parse(request)

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