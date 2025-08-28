import 'server-only'
import { serviceWrapper } from '../../_general/services/general-service'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { ServiceMessage } from '@/libs/share/_general/enums/service-message'
import { PostWorkers } from '../models/post-dao'
import { GetPostWorkersRequest, getPostWorkersRequestSchema } from '../models/get-post-workers-request'
import prisma from '../../_general/managers/database-manager'
import { getAccessiblePostIdsService } from '../../access/services/data-access-service'
import { AccessResponse } from '../../access/models/access-response'

export const getPostWorkersService = async (request: GetPostWorkersRequest): Promise<ServiceResponse<PostWorkers>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostWorkersRequestSchema.parse(request)

    const accessResponse = await getAccessiblePostIdsService();
    if (accessResponse.status !== ServiceResponseStatus.OK) return accessResponse;

    const postWorkers = await getPostWorkers(parsedRequest.id, accessResponse.data)

    if (!postWorkers) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位')
    }

    return {
      status: ServiceResponseStatus.OK,
      data: postWorkers,
    }
  })

const getPostWorkers = async (id: number, accessResponse: AccessResponse): Promise<PostWorkers | undefined> => {
  const where = getWhereClause(id, accessResponse);
  if (!where) return;

  const include = getIncludeClause();

  const postWithRelation = await prisma.post.findUnique({
    where,
    include,
  })

  if (!postWithRelation) return;

  const { postWorkers, ...post } = postWithRelation;

  return {
    ...post,
    workers: postWorkers.map(postWorker => postWorker.worker),
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
        worker: { isDeleted: false },
      },
      include: { worker: true },
    },
  }
}