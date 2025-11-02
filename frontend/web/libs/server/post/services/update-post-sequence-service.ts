import 'server-only';
import { UpdatePostSequenceRequest, updatePostSequenceRequestSchema } from '../models/update-post-sequence-request';
import prisma from '../../_general/managers/database-manager';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessPost } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const updatePostSequenceService = tryCatch(async (
  request: UpdatePostSequenceRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updatePostSequenceRequestSchema.parse(request);

  for (const postId of parsedRequest.postIds) {
    const canAccess = await checkCanAccessPost(postId);
    if (!canAccess) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: MessageContent.NOT_FOUND.replaceAll('{0}', '職位'),
    }
  }

  await execute(parsedRequest.postIds)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (postIds: number[]): Promise<void> => {
  await prisma.$transaction(
    postIds.map((id, index) => 
      prisma.post.update({
        where: { id },
        data: { displayPosition: index },
      })
    )
  )
}