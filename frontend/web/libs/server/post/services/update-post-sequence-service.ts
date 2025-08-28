import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { UpdatePostSequenceRequest, updatePostSequenceRequestSchema } from '../models/update-post-sequence-request';
import { getAccessiblePostIdsService } from '../../access/services/data-access-service';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';
import prisma from '../../_general/managers/database-manager';

export const updatePostSequenceService = async (request: UpdatePostSequenceRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = updatePostSequenceRequestSchema.parse(request);

    const checkResponse = await checkPosts(parsedRequest.postIds)
    if (checkResponse && checkResponse.status !== ServiceResponseStatus.OK) return checkResponse;

    await savePosts(parsedRequest.postIds)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkPosts = async (postIds: number[]): Promise<ServiceResponse | undefined> => {
  const accessResponse = await getAccessiblePostIdsService()
  if (accessResponse.status !== ServiceResponseStatus.OK) return accessResponse;
  if (accessResponse.data.canAccessAll) return;

  for (const postId of postIds) {
    if (!accessResponse.data.ids.includes(postId)) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位'),
      }
    }
  }
}

const savePosts = async (postIds: number[]): Promise<void> => {
  await prisma.$transaction(
    postIds.map((id, index) => 
      prisma.post.update({
        where: { id },
        data: { displayPosition: index },
      })
    )
  )
}