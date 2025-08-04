import 'server-only';
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeletePostRequest, deletePostRequestSchema } from '../models/delete-post-request';
import prisma from '../../_general/managers/database-manager';

export const deletePost = async (request: DeletePostRequest): Promise<ServerResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deletePostRequestSchema.parse(request)

    await prisma.post.delete({
      where: { id: parsedRequest.postId },
    })

    return {
      status: ServerResponseStatus.OK,
      data: {},
    }
  })