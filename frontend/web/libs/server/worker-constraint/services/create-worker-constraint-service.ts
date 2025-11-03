import 'server-only'
import { CreateWorkerConstraintRequest, createWorkerConstraintRequestSchema } from "../models/create-worker-constraint-request";
import prisma from "../../_general/managers/database-manager";
import { WorkerConstraint } from '@/external/prisma-generated';
import { Id } from '../../_general/models/id';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const createWorkerConstraintService = tryCatch(async (
  request: CreateWorkerConstraintRequest,
): Promise<ServiceResponse<Id>> => {
  const parsedRequest = createWorkerConstraintRequestSchema.parse(request)

  const canAccess = await checkCanAccessDepartment(parsedRequest.departmentId)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '部門'),
  }

  const entity = await execute(parsedRequest)

  return {
    status: ServiceResponseStatus.OK,
    data: entity.id,
  }
})

const execute = async (request: CreateWorkerConstraintRequest): Promise<WorkerConstraint> =>
  await prisma.workerConstraint.create({
    data: {
      departmentId: request.departmentId,
      workerConstraintTypeId: request.workerConstraintTypeId,
      weighting: request.weighting,
      workerConstraintWorkers: {
        create: request.workerIds.map(id => ({ workerId: id })),
      }
    },
  })
