import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';
import { GetWorkerConstraintTypesRequest, getWorkerConstraintTypesRequestSchema } from '../models/get-worker-constraint-types-request';
import { WorkerConstraintType } from '@/external/prisma-generated';

export const getWorkerConstraintTypesService = cache(async (request: GetWorkerConstraintTypesRequest): Promise<ServiceResponse<WorkerConstraintType[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getWorkerConstraintTypesRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetWorkerConstraintTypesRequest): Promise<WorkerConstraintType[]> => {
  return await prisma.workerConstraintType.findMany({
    where: {
      id: request.where?.id,
      name: request.where?.name,
      enum: request.where?.enum,
    },
    take: request.take,
  })
}