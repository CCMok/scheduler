import 'server-only'
import prisma from '../../_general/managers/database-manager';
import { PostWithPostWorkersCount } from '../models/post-dao';
import { Prisma } from '@/external/prisma-generated';
import { isNil } from 'lodash';
import { cache } from 'react';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { filterAccessibleDepartments } from '../../access/utils/data-access-utils';

export const getPostsWithPostWorkersCountService = cache(tryCatch(async (
  id?: number,
  departmentId?: number,
  name?: string,
  workerId?: number,
): Promise<ServiceResponse<PostWithPostWorkersCount[]>> => {
  const entities = await findEntities(id, departmentId, name, workerId);
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
  workerId?: number,
): Promise<PostWithPostWorkersCount[]> => {
  const postWorkerWhereClause = getPostWorkersWhereClause(workerId);

  return await prisma.post.findMany({
    where: {
      id,
      departmentId,
      name,
      isDeleted: false,
      ...postWorkerWhereClause,
    },
    include: {
      _count: {
        select: { postWorkers: true },
      },
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    }
  })
}

const getPostWorkersWhereClause = (workerId?: number): Prisma.PostWhereInput => {
  if (isNil(workerId)) return {};
  return {
    postWorkers: {
      some: {
        workerId,
        worker: {
          isDeleted: false,
        },
      },
    },
  }
}