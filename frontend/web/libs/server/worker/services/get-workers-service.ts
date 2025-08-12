import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Prisma, Worker } from '@/external/prisma-generated';
import { GetWorkersRequest, getWorkersRequestSchema } from '../models/get-workers-request';
import { serviceWrapper } from '../../_general/services/general-service';

export const getWorkersService = async (request: GetWorkersRequest): Promise<ServiceResponse<Worker[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getWorkersRequestSchema.parse(request);

    const query = getQuery(parsedRequest);

    const workers = await prisma.worker.findMany(query);

    return {
      status: ServiceResponseStatus.OK,
      data: workers,
    };
  });

const getQuery = (request: GetWorkersRequest): Prisma.WorkerFindManyArgs => {
  const where: Prisma.WorkerWhereInput = request.where ? { ...request.where } : {};
  where.isDeleted = false;

  const orderBy: Prisma.WorkerOrderByWithRelationInput = {};
  if (request.orderBy) {
    for (const requestOrderBy of request.orderBy) {
      orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
    }
  }

  return { where, orderBy };
}