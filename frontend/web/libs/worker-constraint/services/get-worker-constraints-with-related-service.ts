import 'server-only'
import prisma from '../../_general/managers/database-manager';
import { cache } from 'react';
import { WorkerConstraintWithRelated } from '../models/worker-constraint-dao';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { Prisma } from '@/external/prisma-generated';
import { filterAccessibleDepartments } from '../../access/utils/data-access-utils';

export const getWorkerConstraintWithRelated = cache(tryCatch(async (
  id?: number,
  departmentId?: number,
  workerConstraintTypeId?: number,
): Promise<ServiceResponse<WorkerConstraintWithRelated[]>> => {
  const entities = await findEntities(id, departmentId, workerConstraintTypeId);
  const filteredEntities = await filterAccessibleDepartments(entities, entity => entity.departmentId)
  return {
    status: ServiceResponseStatus.OK,
    data: filteredEntities,
  }
}))

const findEntities = async (
  id?: number,
  departmentId?: number,
  workerConstraintTypeId?: number,
): Promise<WorkerConstraintWithRelated[]> => {
  const entities = await prisma.workerConstraint.findMany({
    where: {
      id,
      departmentId,
      workerConstraintTypeId,
    },
    include: {
      workerConstraintType: true,
      workerConstraintWorkers: {
        include: {
          worker: true,
        },
      },
    },
    orderBy: {
      id: Prisma.SortOrder.asc,
    },
  })

  return entities.map(entity => ({
    ...entity,
    weighting: entity.weighting.toNumber(),
  }))
}