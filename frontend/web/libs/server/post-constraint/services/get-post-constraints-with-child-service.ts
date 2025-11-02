import 'server-only'
import prisma from '../../_general/managers/database-manager';
import { cache } from 'react';
import { PostConstraintWithChild } from '../models/post-constraint-dao';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { Prisma } from '@/external/prisma-generated';
import { filterAccessibleDepartments } from '../../organization/utils/access-organization-utils';

export const getPostConstraintsWithChildService = cache(tryCatch(async (
  id?: number,
  departmentId?: number,
  postConstraintTypeId?: number,
): Promise<ServiceResponse<PostConstraintWithChild[]>> => {
  const entities = await findEntities(id, departmentId, postConstraintTypeId);
  const filteredEntities = await filterAccessibleDepartments(entities, entity => entity.departmentId)
  return {
    status: ServiceResponseStatus.OK,
    data: filteredEntities,
  }
}))

const findEntities = async (
  id?: number,
  departmentId?: number,
  postConstraintTypeId?: number,
): Promise<PostConstraintWithChild[]> => {
  const entities = await prisma.postConstraint.findMany({
    where: {
      id,
      departmentId,
      postConstraintTypeId,
    },
    include: {
      postConstraintType: true,
      postConstraintPosts: {
        include: {
          post: true,
        }
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