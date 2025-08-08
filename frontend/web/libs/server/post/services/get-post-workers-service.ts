import 'server-only'
import { serviceWrapper } from '../../_general/services/general-service'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { ServiceMessage } from '@/libs/share/_general/enums/service-message'
import { PostWorkers } from '../models/post-dao'
import { GetPostWorkersRequest, getPostWorkersRequestSchema } from '../models/get-post-workers-request'
import prisma from '../../_general/managers/database-manager'

export const getPostWorkersService = async (request: GetPostWorkersRequest): Promise<ServiceResponse<PostWorkers>> => 
  await serviceWrapper(async () => {
    const parsedRequest = getPostWorkersRequestSchema.parse(request)

    const postWorkers = await getPostWorkers(parsedRequest.id)

    if (!postWorkers) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位')
    }
  
    return { 
      status: ServiceResponseStatus.OK,
      data: postWorkers,
    }
  })

const getPostWorkers = async (id: number): Promise<PostWorkers | undefined> => {
  const postWithRelation = await prisma.post.findUnique({
    where: { id },
    include: {
      postWorkers: {
        include: { worker: true },
      },
    },
  })

  if (!postWithRelation) return;

  const { postWorkers, ...post } = postWithRelation;
  
  return { 
    ...post,
    workers: postWorkers.map(postWorker => postWorker.worker),
  }
}