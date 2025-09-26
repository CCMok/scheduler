import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { getDeptIdFilter } from '../../access/utils/data-access-utils';
import { cache } from 'react';
import { GetWorkerConstraintWorkersRequest, getWorkerConstraintWorkersRequestSchema } from '../models/get-worker-constraints-workers-request';
import { WorkerConstraintWorkers } from '../models/worker-constraint-dao';

export const getWorkerConstraintWorkersService = cache(async (request: GetWorkerConstraintWorkersRequest): Promise<ServiceResponse<WorkerConstraintWorkers[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getWorkerConstraintWorkersRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetWorkerConstraintWorkersRequest): Promise<WorkerConstraintWorkers[]> => {
  const departmentId = await getDeptIdFilter(request.where?.departmentId);

  return await prisma.workerConstraint.findMany({
    where: {
      id: request.where?.id,
      departmentId,
      workerConstraintTypeId: request.where?.workerConstraintTypeId,
      weighting: request.where?.weighting,
    },
    include: {
      workerConstraintType: true,
      workerConstraintWorkers: {
        include: {
          worker: true,
        },
      },
    },
    take: request.take,
  })
}