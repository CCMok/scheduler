import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Prisma, Worker } from '@/external/prisma-generated';
import { GetWorkersRequest, getWorkersRequestSchema } from '../models/get-workers-request';

export const getWorkersService = async (request: GetWorkersRequest): Promise<ServiceResponse<Worker[]>> => {
  const parsedRequest = getWorkersRequestSchema.parse(request);

  const query = getQuery(parsedRequest);

  const workers = await prisma.worker.findMany(query);

  return {
    status: ServiceResponseStatus.OK,
    data: workers,
  };
};

const getQuery = (request: GetWorkersRequest): Prisma.WorkerFindManyArgs => {
  const where: Prisma.WorkerWhereInput = request.where ? { ...request.where } : {};

  const orderBy: Prisma.WorkerOrderByWithRelationInput = {};
  if (request.orderBy) {
    for (const order of request.orderBy) {
      orderBy[order.field] = order.direction;
    }
  }

  return { where, orderBy };
}