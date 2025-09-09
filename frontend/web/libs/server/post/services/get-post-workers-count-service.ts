import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { PostWorkersCount } from '../models/post-dao';
import { GetPostWorkersCountRequest, getPostWorkersCountRequestSchema } from '../models/get-post-workers-count-request';
import { getDeptIdFilter } from '../../access/utils/data-access-utils';

export const getPostWorkersCountService = async (
  request: GetPostWorkersCountRequest
): Promise<ServiceResponse<PostWorkersCount[]>> =>
  await serviceWrapper<PostWorkersCount[]>(async () => {
    const parsedRequest = getPostWorkersCountRequestSchema.parse(request);
    const entities = await findEntity(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  })

const findEntity = async (request: GetPostWorkersCountRequest): Promise<PostWorkersCount[]> => {
  const departmentId = await getDeptIdFilter(request.where?.departmentId);
  const isDeleted = request.where?.isDeleted ?? false;

  return await prisma.post.findMany({
    where: {
      id: request.where?.id,
      name: request.where?.name,
      departmentId,
      postWorkers: {
        some: {
          workerId: request.where?.workerId,
          worker: { isDeleted },
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