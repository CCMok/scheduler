import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { GetWorkersPostCountRequest, getWorkersPostCountRequestSchema } from '../models/get-worker-posts-count-request';
import { WorkersPostWorkerCount } from '../models/worker-dao';
import { getDeptIdFilter } from '../../access/utils/data-access-utils';
import { isNil } from 'lodash';
import { Prisma } from '@/external/prisma-generated';
import { cache } from 'react';

export const getWorkerPostsCountService = cache(async (request: GetWorkersPostCountRequest): Promise<ServiceResponse<WorkersPostWorkerCount[]>> =>
  await serviceWrapper<WorkersPostWorkerCount[]>(async () => {
    const parsedRequest = getWorkersPostCountRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetWorkersPostCountRequest): Promise<WorkersPostWorkerCount[]> => {
  const departmentId = await getDeptIdFilter(request.where?.departmentId);
  const isDeleted = request.where?.isDeleted ?? false;
  const postWorkerWhereClause = getPostWorkersWhereClause(request, isDeleted);

  return await prisma.worker.findMany({
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

const getPostWorkersWhereClause = (request: GetWorkersPostCountRequest, isDeleted: boolean): Prisma.WorkerWhereInput => {
  if (isNil(request.where?.postId)) return {};
  return {
    postWorkers: {
      some: {
        postId: request.where.postId,
        post: { isDeleted },
      },
    },
  }
}