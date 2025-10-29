import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Prisma } from '@/external/prisma-generated';
import { GetUsersRequest, getUsersRequestSchema } from '../models/get-users-role-request';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';
import { UserExcludePasswordRole } from '../models/user-dao';

export const getUsersRoleService = cache(async (request: GetUsersRequest): Promise<ServiceResponse<UserExcludePasswordRole[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getUsersRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    };
  }))

const findEntities = async (request: GetUsersRequest): Promise<UserExcludePasswordRole[]> => {
  const orderBy = getOrderByClause(request);

  return await prisma.user.findMany({
    where: {
      id: request.where?.id,
      email: request.where?.email,
      name: request.where?.name,
      roleId: request.where?.roleId,
    },
    orderBy,
    take: request.take,
    omit: {
      password: true,
    },
    include: {
      role: true,
    },
  });
}

const getOrderByClause = (request: GetUsersRequest) => {
  const orderBy: Prisma.UserOrderByWithRelationInput = {};

  if (!request.orderBys) return orderBy;

  for (const requestOrderBy of request.orderBys) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}