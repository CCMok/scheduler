import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { checkCanAccessPost } from '../../organization/utils/access-organization-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { MessageContent } from '../../_general/enums/message';

export const deletePostService = tryCatch(async (
  id: number,
): Promise<ServiceResponse> => {
  const canAccess = await checkCanAccessPost(id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '職位'),
  }

  await execute(id)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (id: number): Promise<void> => {
  await prisma.$transaction([
    prisma.post.update({
      where: { id },
      data: { isDeleted: true },
    }),
    prisma.postWorker.deleteMany({
      where: { postId: id },
    }),
    prisma.postConstraintPost.deleteMany({
      where: { postId: id },
    }),
  ])
}