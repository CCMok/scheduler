import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { getDeptIdFilter } from '../../access/utils/data-access-utils';
import { cache } from 'react';
import { GetPostConstraintPostsRequest, getPostConstraintPostsRequestSchema } from '../models/get-post-constraints-posts-request';
import { PostConstraintPosts } from '../models/post-constraint-dao';

export const getPostConstraintPostsService = cache(async (request: GetPostConstraintPostsRequest): Promise<ServiceResponse<PostConstraintPosts[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostConstraintPostsRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetPostConstraintPostsRequest): Promise<PostConstraintPosts[]> => {
  const departmentId = await getDeptIdFilter(request.where?.departmentId);

  const entities = await prisma.postConstraint.findMany({
    where: {
      id: request.where?.id,
      departmentId,
      postConstraintTypeId: request.where?.postConstraintTypeId,
      weighting: request.where?.weighting,
    },
    include: {
      postConstraintType: true,
      postConstraintPosts: {
        include: {
          post: true,
        },
      },
    },
    take: request.take,
  })

  return entities.map(entity => ({
    ...entity,
    weighting: entity.weighting.toNumber(),
  }))
}