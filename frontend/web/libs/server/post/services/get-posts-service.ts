import 'server-only';
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { GetPostsRequest, getPostsRequestSchema } from "../models/get-posts-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import prisma from "../../_general/managers/database-manager";
import { Post } from '@/external/prisma-generated';

export const getPosts = async (request: GetPostsRequest): Promise<ServerResponse<Post[]>> => {
  return {
    status: ServerResponseStatus.INTERNAL_ERROR
  };

  const parsedRequest = getPostsRequestSchema.parse(request);

  const posts = await prisma.post.findMany({
    where: { departmentId: parsedRequest.departmentId },
    orderBy: {
      name: 'asc',
    },
  });

  return {
    status: ServerResponseStatus.OK,
    data: posts,
  };
}; 