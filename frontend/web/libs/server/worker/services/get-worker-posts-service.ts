import 'server-only'
import { serviceWrapper } from '../../_general/services/general-service'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { ServiceMessage } from '@/libs/share/_general/enums/service-message'
import { WorkerPosts } from '../models/worker-dao'
import { GetWorkerPostsRequest, getWorkerPostsRequestSchema } from '../models/get-worker-posts-request'
import prisma from '../../_general/managers/database-manager'
import { getAccessibleWorkerIdsService } from '../../access/services/data-access-service'
import { AccessResponse } from '../../access/models/access-response'

export const getWorkerPostsService = async (request: GetWorkerPostsRequest): Promise<ServiceResponse<WorkerPosts>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getWorkerPostsRequestSchema.parse(request)

    const accessResponse = await getAccessibleWorkerIdsService();
    if (accessResponse.status !== ServiceResponseStatus.OK) return accessResponse;

    const workerPosts = await getWorkerPosts(parsedRequest.id, accessResponse.data)

    if (!workerPosts) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '人員')
    }

    return {
      status: ServiceResponseStatus.OK,
      data: workerPosts,
    }
  })

const getWorkerPosts = async (id: number, accessResponse: AccessResponse): Promise<WorkerPosts | undefined> => {
  const where = getWhereClause(id, accessResponse);
  if (!where) return;

  const include = getIncludeClause();

  const workerWithRelation = await prisma.worker.findUnique({
    where,
    include,
  })

  if (!workerWithRelation) return;

  const { postWorkers, ...worker } = workerWithRelation;

  return {
    ...worker,
    posts: postWorkers.map(postWorker => postWorker.post),
  }
}

const getWhereClause = (id: number, accessResponse: AccessResponse) => {
  const where = {
    id,
    isDeleted: false,
  }

  if (accessResponse.canAccessAll) return where;

  if (!accessResponse.ids.includes(id)) return

  return where;
}

const getIncludeClause = () => {
  return {
    postWorkers: {
      where: {
        post: { isDeleted: false },
      },
      include: { post: true },
    },
  }
}