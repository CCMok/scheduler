import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { GetPostsRequest, getPostsRequestSchema } from "../models/get-posts-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Post, Prisma } from '@/external/prisma-generated';
import { serviceWrapper } from '../../_general/services/general-service';

// TODO: check department access for posts and workers in get / create / update / delete
export const getPostsService = async (request: GetPostsRequest): Promise<ServiceResponse<Post[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostsRequestSchema.parse(request);

    const query = getQuery(parsedRequest);

    const posts = await prisma.post.findMany(query);

    return {
      status: ServiceResponseStatus.OK,
      data: posts,
    };
  })

const getQuery = (request: GetPostsRequest): Prisma.PostFindManyArgs => {
  const where: Prisma.PostWhereInput = request.where ? { ...request.where } : {};
  where.isDeleted = false;

  const orderBy: Prisma.PostOrderByWithRelationInput = {};
  if (request.orderBy) {
    for (const requestOrderBy of request.orderBy) {
      orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
    }
  }

  return { where, orderBy };
}