import 'server-only';
import prisma from "../../_general/managers/database-manager";
import { Prisma, Worker } from '@/external/prisma-generated';
import { cache } from 'react';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { filterAccessibleDepartments } from '../../access/utils/data-access-utils';

export const getWorkersService = cache(tryCatch(async (
  id?: number,
  departmentId?: number,
  name?: string,
): Promise<ServiceResponse<Worker[]>> => {
  const entities = await findEntities(id, departmentId, name);
  const filteredEntities = await filterAccessibleDepartments(entities, entity => entity.departmentId)

  return {
    status: ServiceResponseStatus.OK,
    data: filteredEntities,
  }
}))

const findEntities = async (
  id?: number,
  departmentId?: number,
  name?: string,
): Promise<Worker[]> => {
  return await prisma.worker.findMany({
    where: {
      id,
      departmentId,
      name,
      isDeleted: false,
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })
}