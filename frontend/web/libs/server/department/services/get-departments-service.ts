import 'server-only'
import { cache } from "react";
import { ServiceResponse, ServiceResponseStatus } from "../../_general/models/service-response";
import { Department, Prisma } from "@/external/prisma-generated";
import { tryCatch } from "../../_general/services/try-catch-wrapper";
import prisma from "../../_general/managers/database-manager";
import { filterAccessibleOrganization } from '../../organization/utils/accessible-organization-utils';

export const getDepartmentsService = cache(tryCatch(async (
  id?: number,
  name?: string,
  organizationId?: number,
): Promise<ServiceResponse<Department[]>> => {
  const entities = await findEntities(id, name, organizationId);
  const filteredEntities = await filterAccessibleOrganization(entities, entity => entity.organizationId)
  return {
    status: ServiceResponseStatus.OK,
    data: filteredEntities,
  }
}))

const findEntities = async (id?: number, name?: string, organizationId?: number): Promise<Department[]> => {
  return await prisma.department.findMany({
    where: {
      id,
      name,
      organizationId,
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })
}