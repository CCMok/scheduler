import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Prisma, Role } from '@/external/prisma-generated';
import { GetRolesRequest, getRolesRequestSchema } from '../models/get-roles-request';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';

export const getRolesService = cache(async (request: GetRolesRequest): Promise<ServiceResponse<Role[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getRolesRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    };
  }))

const findEntities = async (request: GetRolesRequest): Promise<Role[]> => {
  const orderBy = getOrderByClause(request);

  return await prisma.role.findMany({
    where: {
      id: request.where?.id,
      name: request.where?.name,
      enum: request.where?.enum,
    },
    orderBy,
    take: request.take,
  });
}

const getOrderByClause = (request: GetRolesRequest) => {
  const orderBy: Prisma.RoleOrderByWithRelationInput = {};

  if (!request.orderBys) return orderBy;

  for (const requestOrderBy of request.orderBys) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}