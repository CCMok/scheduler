import 'server-only'
import prisma from '../../_general/managers/database-manager';
import { cache } from 'react';
import { PostConstraintType, Prisma } from '@/external/prisma-generated';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const getPostConstraintTypesService = cache(tryCatch(async (
  id?: number,
  name?: string,
  enumValue?: number,
): Promise<ServiceResponse<PostConstraintType[]>> => {
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
): Promise<PostConstraintType[]> => {
  return await prisma.postConstraintType.findMany({
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