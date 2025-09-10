import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeletePostRequest, deletePostRequestSchema } from '../models/delete-post-request';
import prisma from '../../_general/managers/database-manager';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';
import { checkPostIdAccess } from '../../access/utils/data-access-utils';

export const deletePostService = async (request: DeletePostRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deletePostRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.postId);
    if (checkAccessResponse) return checkAccessResponse;

    await execute(parsedRequest)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (postId: number): Promise<ServiceResponse | undefined> => {
  const pass = await checkPostIdAccess(postId);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位'),
  }
}

const execute = async (request: DeletePostRequest): Promise<void> => {
  await prisma.$transaction([
    prisma.post.update({
      where: { id: request.postId },
      data: { isDeleted: true },
    }),
    prisma.postWorker.deleteMany({
      where: { postId: request.postId },
    }),
    prisma.postConstraintPost.deleteMany({
      where: { postId: request.postId },
    }),
  ])
}