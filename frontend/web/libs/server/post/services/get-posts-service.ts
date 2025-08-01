import 'server-only';
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { GetPostsRequest, getPostsRequestSchema } from "../models/get-posts-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import prisma from "../../_general/managers/database-manager";
import { Post } from '@/external/prisma-generated';
import { serviceWrapper } from '../../_general/services/general-service';

export const getPosts = async (request: GetPostsRequest): Promise<ServerResponse<Post[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostsRequestSchema.parse(request);

    const posts = await prisma.post.findMany({
      where: { departmentId: parsedRequest.departmentId },
    });

    return {
      status: ServerResponseStatus.OK,
      data: posts,
    };
  })