import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { GetPostsRequest, getPostsRequestSchema } from "../models/get-posts-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Post } from '@/external/prisma-generated';
import { serviceWrapper } from '../../_general/services/general-service';

export const getPosts = async (request: GetPostsRequest): Promise<ServiceResponse<Post[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostsRequestSchema.parse(request);

    const posts = await prisma.post.findMany({
      where: { departmentId: parsedRequest.departmentId },
    });

    return {
      status: ServiceResponseStatus.OK,
      data: posts,
    };
  })