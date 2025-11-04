import 'server-only';
import prisma from "../../_general/managers/database-manager";
import { Prisma, Role } from '@/external/prisma-generated';
import { cache } from 'react';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const getRolesService = cache(tryCatch(async (
  id?: number,
  name?: string,
  enumValue?: number,
): Promise<ServiceResponse<Role[]>> => {
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
): Promise<Role[]> => {
  return await prisma.role.findMany({
    where: {
      id,
      name,
      enum: enumValue,
    },
    orderBy: {
      enum: Prisma.SortOrder.asc,
    },
  });
}