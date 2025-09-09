import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { AccessResponse } from '../../access/models/access-response';
import { isNil } from 'lodash';
import { getAccessibleDepartmentIdsService } from '../../access/services/data-access-service';
import { GetWorkersPostCountRequest, getWorkersPostCountRequestSchema } from '../models/get-worker-posts-count-request';
import { WorkersPostWorkerCount } from '../models/worker-dao';

export const getWorkerPostsCountService = async (
  request: GetWorkersPostCountRequest
): Promise<ServiceResponse<WorkersPostWorkerCount[]>> =>
  await serviceWrapper<WorkersPostWorkerCount[]>(async () => {
    const parsedRequest = getWorkersPostCountRequestSchema.parse(request);

    const accessServiceResponse = await getAccessibleDepartmentIdsService();
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

    const entities = await findEntity(parsedRequest, accessServiceResponse.data);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  })

const findEntity = async (request: GetWorkersPostCountRequest, accessResponse: AccessResponse): Promise<WorkersPostWorkerCount[]> => {
  const departmentIdFilter = getDeptIdFilter(request, accessResponse);
  const isDeleted = request.where?.isDeleted ?? false;

  return await prisma.worker.findMany({
    where: {
      id: request.where?.id,
      name: request.where?.name,
      departmentId: departmentIdFilter,
      postWorkers: {
        some: {
          postId: request.where?.postId,
          post: { isDeleted },
        },
      },
      isDeleted,
    },
    include: {
      _count: {
        select: { postWorkers: true },
      },
    },
    take: request.take,
  })
}

const getDeptIdFilter = (request: GetWorkersPostCountRequest, accessResponse: AccessResponse) => {
  if (accessResponse.canAccessAll) {
    if (isNil(request.where?.departmentId)) return;
    return request.where.departmentId;
  }

  if (isNil(request.where?.departmentId)) return { in: accessResponse.ids };

  if (accessResponse.ids.includes(request.where.departmentId)) return request.where.departmentId;

  return { in: [] }
}