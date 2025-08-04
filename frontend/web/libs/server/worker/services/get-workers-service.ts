import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Worker } from '@/external/prisma-generated';
import { GetWorkersRequest, getWorkersRequestSchema } from '../models/get-workers-request';

export const getWorkers = async (request: GetWorkersRequest): Promise<ServiceResponse<Worker[]>> => {
  const parsedRequest = getWorkersRequestSchema.parse(request);

  const workers = await prisma.worker.findMany({
    where: { departmentId: parsedRequest.departmentId },
  });

  return {
    status: ServiceResponseStatus.OK,
    data: workers,
  };
}; 