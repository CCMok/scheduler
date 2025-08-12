import 'server-only'
import { serviceWrapper } from '../../_general/services/general-service'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { ServiceMessage } from '@/libs/share/_general/enums/service-message'
import { WorkerPosts } from '../models/worker-dao'
import { GetWorkerPostsRequest, getWorkerPostsRequestSchema } from '../models/get-worker-posts-request'
import prisma from '../../_general/managers/database-manager'

export const getWorkerPostsService = async (request: GetWorkerPostsRequest): Promise<ServiceResponse<WorkerPosts>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getWorkerPostsRequestSchema.parse(request)

    const workerPosts = await getWorkerPosts(parsedRequest.id)

    if (!workerPosts) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '人員')
    }

    return {
      status: ServiceResponseStatus.OK,
      data: workerPosts,
    }
  })

const getWorkerPosts = async (id: number): Promise<WorkerPosts | undefined> => {
  const workerWithRelation = await prisma.worker.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      postWorkers: {
        where: {
          post: { isDeleted: false },
        },
        include: { post: true },
      },
    },
  })

  if (!workerWithRelation) return;

  const { postWorkers, ...worker } = workerWithRelation;

  return {
    ...worker,
    posts: postWorkers.map(postWorker => postWorker.post),
  }
}