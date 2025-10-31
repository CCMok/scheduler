import { cache } from "react";
import { ServiceResponse, ServiceResponseStatus } from "../../_general/models/service-response";
import { Department } from "@/external/prisma-generated";
import { tryCatch } from "../../_general/services/try-catch-wrapper";

export const getDepartmentsService = cache(tryCatch(async (
  id?: number,
  name?: string,
  organizationId?: number,
): Promise<ServiceResponse<Department[]>> => {
  console.log('call getDepartmentsService')
  return {
    status: ServiceResponseStatus.OK,
    data: [],
  }
}))