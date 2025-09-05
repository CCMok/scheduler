import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { AccessResponse } from '../../access/models/access-response';
import { isNil } from 'lodash';
import { getAccessibleDepartmentIdsService } from '../../access/services/data-access-service';
import { GetWorkerPostsCountRequest, getWorkerPostsCountRequestSchema } from '../models/get-worker-posts-count-request';
import { WorkerPostsCount } from '../models/worker-dao';

export const getWorkerPostsCountService = async (
  request: GetWorkerPostsCountRequest
): Promise<ServiceResponse<WorkerPostsCount[]>> =>
  await serviceWrapper<WorkerPostsCount[]>(async () => {
    const parsedRequest = getWorkerPostsCountRequestSchema.parse(request);

    const accessServiceResponse = await getAccessibleDepartmentIdsService();
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

    const departments = await findEntity(parsedRequest, accessServiceResponse.data);

    return {
      status: ServiceResponseStatus.OK,
      data: departments,
    }
  })

const findEntity = async (request: GetWorkerPostsCountRequest, accessResponse: AccessResponse): Promise<WorkerPostsCount[]> => {
  const departmentIdFilter = getDeptIdFilter(request, accessResponse);

  return await prisma.worker.findMany({
    where: {
      ...request.where,
      departmentId: departmentIdFilter,
      isDeleted: request.where?.isDeleted ?? false,
    },
    include: {
      _count: {
        select: {
          postWorkers: {
            where: {
              postId: request.post?.id, // TODO: fix 0 count in worker / post page
              post: { isDeleted: request.post?.isDeleted ?? false },
            },
          },
        },
      },
    },
    take: request.take,
  })
}

const getDeptIdFilter = (request: GetWorkerPostsCountRequest, accessResponse: AccessResponse) => {
  if (accessResponse.canAccessAll) {
    if (isNil(request.where?.departmentId)) return;
    return request.where.departmentId;
  }

  if (isNil(request.where?.departmentId)) return { in: accessResponse.ids };

  if (accessResponse.ids.includes(request.where.departmentId)) return request.where.departmentId;

  return { in: [] }
}