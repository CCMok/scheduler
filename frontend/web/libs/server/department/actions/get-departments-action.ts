'use server';

import { getDepartmentsService } from "../services/get-departments-service";
import { ServiceResponse, ServiceResponseStatus } from "../../_general/models/service-response";
import { Department } from "@/external/prisma-generated";
import { getSession } from "../../_general/managers/session-manager";
import { filterAccessibleOrganization } from "../../organization/utils/accessible-organization-utils";

export const getDepartmentsAction = async (
  id?: number,
  name?: string,
  organizationId?: number,
): Promise<ServiceResponse<Department[]>> => {
  const response = await getDepartmentsService(id, name, organizationId)
  if (response.status !== ServiceResponseStatus.OK) return response

  const session = await getSession()
  if (!session) return {
    ...response,
    data: [],
  }
  
  const filteredDepartments = await filterAccessibleOrganization(response.data, department => department.organizationId)
  return {
    ...response,
    data: filteredDepartments,
  }
}