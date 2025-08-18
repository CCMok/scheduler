import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { GetPostsRequest, getPostsRequestSchema } from "../models/get-posts-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Post, Prisma } from '@/external/prisma-generated';
import { serviceWrapper } from '../../_general/services/general-service';
import { getAccessibleDepartmentIdsService } from '../../access/services/access-service';
import { isNil } from 'lodash';
import { AccessResponse } from '../../access/models/access-response';

export const getPostsService = async (request: GetPostsRequest): Promise<ServiceResponse<Post[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostsRequestSchema.parse(request);

    const accessServiceResponse = await getAccessibleDepartmentIdsService();
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse

    const query = getQuery(parsedRequest, accessServiceResponse.data);

    const posts = await prisma.post.findMany(query);

    return {
      status: ServiceResponseStatus.OK,
      data: posts,
    };
  })

const getQuery = (request: GetPostsRequest, accessResponse: AccessResponse) => {
  const where = getWhereClause(request, accessResponse);
  const orderBy = getOrderByClause(request);

  return { where, orderBy };
}

const getWhereClause = (request: GetPostsRequest, accessResponse: AccessResponse) => {
  const departmentIdFilter = getDepartmentIdFilter(request, accessResponse);

  return {
    ...request.where,
    isDeleted: false,
    departmentId: departmentIdFilter,
  }
}

const getDepartmentIdFilter = (request: GetPostsRequest, accessResponse: AccessResponse) => {
  if (accessResponse.canAccessAll) {
    if (isNil(request.where?.departmentId)) return;
    return request.where.departmentId;
  }

  if (isNil(request.where?.departmentId)) return { in: accessResponse.ids };

  if (accessResponse.ids.includes(request.where.departmentId)) return request.where.departmentId;

  return { in: [] }
}

const getOrderByClause = (request: GetPostsRequest) => {
  const orderBy: Prisma.PostOrderByWithRelationInput = {};

  if (!request.orderBy) return orderBy;

  for (const requestOrderBy of request.orderBy) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}