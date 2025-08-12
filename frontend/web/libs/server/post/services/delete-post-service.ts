import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeletePostRequest, deletePostRequestSchema } from '../models/delete-post-request';
import prisma from '../../_general/managers/database-manager';

// TODO: delete post and worker. delete relationship 
export const deletePostService = async (request: DeletePostRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deletePostRequestSchema.parse(request)

    await prisma.post.update({
      where: { id: parsedRequest.postId },
      data: { isDeleted: true },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })