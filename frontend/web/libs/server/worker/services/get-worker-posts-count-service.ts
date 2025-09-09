import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { GetWorkersPostCountRequest, getWorkersPostCountRequestSchema } from '../models/get-worker-posts-count-request';
import { WorkersPostWorkerCount } from '../models/worker-dao';
import { getDeptIdFilter } from '../../access/utils/data-access-utils';

export const getWorkerPostsCountService = async (request: GetWorkersPostCountRequest): Promise<ServiceResponse<WorkersPostWorkerCount[]>> =>
  await serviceWrapper<WorkersPostWorkerCount[]>(async () => {
    const parsedRequest = getWorkersPostCountRequestSchema.parse(request);
    const entities = await findEntity(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  })

const findEntity = async (request: GetWorkersPostCountRequest): Promise<WorkersPostWorkerCount[]> => {
  const departmentId = await getDeptIdFilter(request.where?.departmentId);
  const isDeleted = request.where?.isDeleted ?? false;

  return await prisma.worker.findMany({
    where: {
      id: request.where?.id,
      name: request.where?.name,
      departmentId,
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