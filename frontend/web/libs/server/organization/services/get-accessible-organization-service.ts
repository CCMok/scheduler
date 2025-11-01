import { cache } from "react";
import { tryCatch } from "../../_general/services/try-catch-wrapper";
import { Role } from "@/libs/share/_general/enums/role";
import { ServiceResponse, ServiceResponseStatus } from "../../_general/models/service-response";
import { AccessibleResponse } from "../models/accessible-response";
import { Prisma } from "@/external/prisma-generated";
import prisma from "../../_general/managers/database-manager";

export const getAccessibleOrganizationService = cache(tryCatch(async (
  userId: number,
  role: Role,
): Promise<ServiceResponse<AccessibleResponse>> => {
  if (role === Role.SYSTEM_ADMIN) {
    return {
      status: ServiceResponseStatus.OK,
      data: {
        accessAll: true,
      },
    }
  }

  const userOrganizations = await findUserOrganizations(userId);

  return {
    status: ServiceResponseStatus.OK,
    data: {
      accessAll: false,
      ids: userOrganizations.map(u => u.organizationId),
    },
  }
}))

const findUserOrganizations = async (userId: number): Promise<{ organizationId: number }[]> => {
  return await prisma.userOrganization.findMany({
    select: {
      organizationId: true,
    },
    where: {
      userId,
    },
    orderBy: {
      organizationId: Prisma.SortOrder.asc,
    },
  })
}