import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeletePostRequest, deletePostRequestSchema } from '../models/delete-post-request';
import prisma from '../../_general/managers/database-manager';
import { getAccessiblePostIdsService } from '../../access/services/access-service';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';

export const deletePostService = async (request: DeletePostRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deletePostRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.postId);
    if (checkAccessResponse) return checkAccessResponse;

    await prisma.post.update({
      where: { id: parsedRequest.postId },
      data: { isDeleted: true },
    })

    await prisma.postWorker.deleteMany({
      where: { postId: parsedRequest.postId },
    })

    await prisma.postConstraintPost.deleteMany({
      where: { postId: parsedRequest.postId },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (postId: number): Promise<ServiceResponse | undefined> => {
  const accessServiceResponse = await getAccessiblePostIdsService();

  if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

  if (accessServiceResponse.data.canAccessAll || accessServiceResponse.data.ids.includes(postId)) return;

  return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位'),
  }
}