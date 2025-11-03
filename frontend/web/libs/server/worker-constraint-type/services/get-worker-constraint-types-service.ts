import 'server-only'
import prisma from '../../_general/managers/database-manager';
import { cache } from 'react';
import { Prisma, WorkerConstraintType } from '@/external/prisma-generated';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const getWorkerConstraintTypesService = cache(tryCatch(async (
  id?: number,
  name?: string,
  enumValue?: number,
): Promise<ServiceResponse<WorkerConstraintType[]>> => {
  const entities = await findEntities(id, name, enumValue);
  return {
    status: ServiceResponseStatus.OK,
    data: entities,
  }
}))

const findEntities = async (
  id?: number,
  name?: string,
  enumValue?: number,
): Promise<WorkerConstraintType[]> => {
  return await prisma.workerConstraintType.findMany({
    where: { 
      id,
      name,
      enum: enumValue,
    },
    orderBy: {
      enum: Prisma.SortOrder.asc,
    },
  })
}