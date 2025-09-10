import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { PostWorkersCount } from '../models/post-dao';
import { GetPostWorkersCountRequest, getPostWorkersCountRequestSchema } from '../models/get-post-workers-count-request';
import { getDeptIdFilter } from '../../access/utils/data-access-utils';
import { Prisma } from '@/external/prisma-generated';
import { isNil } from 'lodash';
import { cache } from 'react';

export const getPostWorkersCountService = cache(async (request: GetPostWorkersCountRequest): Promise<ServiceResponse<PostWorkersCount[]>> =>
  await serviceWrapper<PostWorkersCount[]>(async () => {
    const parsedRequest = getPostWorkersCountRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetPostWorkersCountRequest): Promise<PostWorkersCount[]> => {
  const departmentId = await getDeptIdFilter(request.where?.departmentId);
  const isDeleted = request.where?.isDeleted ?? false;
  const postWorkerWhereClause = getPostWorkersWhereClause(request, isDeleted);

  return await prisma.post.findMany({
    where: {
      id: request.where?.id,
      name: request.where?.name,
      departmentId,
      isDeleted,
      ...postWorkerWhereClause,
    },
    include: {
      _count: {
        select: { postWorkers: true },
      },
    },
    take: request.take,
  })
}

const getPostWorkersWhereClause = (request: GetPostWorkersCountRequest, isDeleted: boolean): Prisma.PostWhereInput => {
  if (isNil(request.where?.workerId)) return {};
  return {
    postWorkers: {
      some: {
        workerId: request.where.workerId,
        worker: { isDeleted },
      },
    },
  }
}