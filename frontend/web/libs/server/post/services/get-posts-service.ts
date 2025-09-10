import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { GetPostsRequest, getPostsRequestSchema } from "../models/get-posts-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Post, Prisma } from '@/external/prisma-generated';
import { serviceWrapper } from '../../_general/services/general-service';
import { getDeptIdFilter } from '../../access/utils/data-access-utils';

export const getPostsService = async (request: GetPostsRequest): Promise<ServiceResponse<Post[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostsRequestSchema.parse(request);
    const entities = await findEntity(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    };
  })

const findEntity = async (request: GetPostsRequest): Promise<Post[]> => {
  const departmentId = await getDeptIdFilter(request.where?.departmentId);
  const isDeleted = request.where?.isDeleted ?? false;
  const orderBy = getOrderByClause(request);

  return await prisma.post.findMany({
    where: {
      id: request.where?.id,
      departmentId,
      name: request.where?.name,
      isDeleted,
    },
    orderBy,
    take: request.take,
  })
}

const getOrderByClause = (request: GetPostsRequest) => {
  const orderBy: Prisma.PostOrderByWithRelationInput = {};

  if (!request.orderBys) return orderBy;

  for (const requestOrderBy of request.orderBys) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}