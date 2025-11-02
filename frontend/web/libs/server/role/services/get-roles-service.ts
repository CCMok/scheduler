import 'server-only';
import { ServiceResponse as oldServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus as oldServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Prisma, Role } from '@/external/prisma-generated';
import { GetRolesRequest, getRolesRequestSchema } from '../models/get-roles-request';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const getRolesService = cache(tryCatch(async (
  id?: number,
  name?: string,
  enumValue?: number,
): Promise<ServiceResponse<Role[]>> => {
  const entities = await findEntities(id, name, enumValue);
  return {
    status: ServiceResponseStatus.OK,
    data: entities,
  }
}))

const findEntities = async (
  id?: number,
  name?: string,
  enumValue?: number,
): Promise<Role[]> => {
  return await prisma.role.findMany({
    where: {
      id,
      name,
      enum: enumValue,
    },
    orderBy: {
      enum: Prisma.SortOrder.asc,
    },
  });
}

export const oldgetRolesService = cache(async (request: GetRolesRequest): Promise<oldServiceResponse<Role[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getRolesRequestSchema.parse(request);
    const entities = await oldfindEntities(parsedRequest);

    return {
      status: oldServiceResponseStatus.OK,
      data: entities,
    };
  }))

const oldfindEntities = async (request: GetRolesRequest): Promise<Role[]> => {
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