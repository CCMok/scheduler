import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Prisma, Worker } from '@/external/prisma-generated';
import { GetWorkersRequest, getWorkersRequestSchema } from '../models/get-workers-request';
import { serviceWrapper } from '../../_general/services/general-service';
import { getDeptIdFilter } from '../../access/utils/data-access-utils';

export const getWorkersService = async (request: GetWorkersRequest): Promise<ServiceResponse<Worker[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getWorkersRequestSchema.parse(request);
    const entities = await findEntity(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    };
  });

const findEntity = async (request: GetWorkersRequest): Promise<Worker[]> => {
  const departmentId = await getDeptIdFilter(request.where?.departmentId);
  const orderBy = getOrderByClause(request);

  return await prisma.worker.findMany({
    where: {
      id: request.where?.id,
      departmentId,
      name: request.where?.name,
      isDeleted: request.where?.isDeleted ?? false,
    },
    orderBy,
    take: request.take,
  });
}

const getOrderByClause = (request: GetWorkersRequest) => {
  const orderBy: Prisma.WorkerOrderByWithRelationInput = {};

  if (!request.orderBys) return orderBy;

  for (const requestOrderBy of request.orderBys) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}