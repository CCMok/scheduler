import 'server-only';
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import prisma from "../../_general/managers/database-manager";
import { Worker } from '@/external/prisma-generated';
import { GetWorkersRequest, getWorkersRequestSchema } from '../models/get-workers-request';

export const getWorkers = async (request: GetWorkersRequest): Promise<ServerResponse<Worker[]>> => {
  const parsedRequest = getWorkersRequestSchema.parse(request);

  const workers = await prisma.worker.findMany({
    where: { departmentId: parsedRequest.departmentId },
  });

  return {
    status: ServerResponseStatus.OK,
    data: workers,
  };
}; 