import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { GetPostsRequest, getPostsRequestSchema } from "../models/get-posts-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Post, Prisma } from '@/external/prisma-generated';
import { serviceWrapper } from '../../_general/services/general-service';
import { getAccessiblePostIdsService } from '../../access/services/access-service';
import { isNil } from 'lodash';

// TODO: check department access for posts and workers in get / create / update / delete
export const getPostsService = async (request: GetPostsRequest): Promise<ServiceResponse<Post[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostsRequestSchema.parse(request);

    const accessResponse = await getAccessiblePostIdsService();
    if (accessResponse.status !== ServiceResponseStatus.OK) return accessResponse

    const query = getQuery(parsedRequest, accessResponse.data);

    const posts = await prisma.post.findMany(query);

    return {
      status: ServiceResponseStatus.OK,
      data: posts,
    };
  })

const getQuery = (request: GetPostsRequest, accessiblePostIds: number[]): Prisma.PostFindManyArgs => {
  const where = getWhereClause(request, accessiblePostIds);
  const orderBy = getOrderByClause(request);

  return { where, orderBy };
}

const getWhereClause = (request: GetPostsRequest, accessiblePostIds: number[]): Prisma.PostWhereInput => {
  const where: Prisma.PostWhereInput = request.where ? { ...request.where } : {};
  where.isDeleted = false;
  where.id = getIdQuery(request, accessiblePostIds);

  return where;
}

const getIdQuery = (request: GetPostsRequest, accessiblePostIds: number[]): Prisma.PostWhereInput['id'] => {
  if (isNil(request.where?.id)) return { in: accessiblePostIds };

  if (accessiblePostIds.includes(request.where.id)) return request.where.id;

  return { in: [] }
}

const getOrderByClause = (request: GetPostsRequest): Prisma.PostOrderByWithRelationInput => {
  const orderBy: Prisma.PostOrderByWithRelationInput = {};

  if (!request.orderBy) return orderBy;

  for (const requestOrderBy of request.orderBy) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}