import 'server-only';
import prisma from "../../_general/managers/database-manager";
import { Post, Prisma } from '@/external/prisma-generated';
import { cache } from 'react';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { filterAccessibleDepartments } from '../../access/utils/data-access-utils';

export const getPostsService = cache(tryCatch(async (
  id?: number,
  departmentId?: number,
  name?: string,
  orderByDisplayPosition?: boolean,
): Promise<ServiceResponse<Post[]>> => {
  const entities = await findEntities(id, departmentId, name, orderByDisplayPosition);
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
  orderByDisplayPosition?: boolean,
): Promise<Post[]> => {
  const orderBy = getOrderByClause(orderByDisplayPosition);
  return await prisma.post.findMany({
    where: {
      id,
      departmentId,
      name,
      isDeleted: false,
    },
    orderBy,
  })
}

const getOrderByClause = (
  orderByDisplayPosition?: boolean
): Prisma.PostOrderByWithRelationInput => {
  if (orderByDisplayPosition) {
    return {
      displayPosition: Prisma.SortOrder.asc,
    }
  }

  return {
    name: Prisma.SortOrder.asc,
  }
}