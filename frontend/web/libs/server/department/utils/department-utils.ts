import { Prisma } from "@/external/prisma-generated"
import { GetDepartmentsRequest } from "../models/get-departments-request"
import { getOrgIdFilter } from "../../access/utils/data-access-utils";

export const getDepartmentQuery = async (request: GetDepartmentsRequest): Promise<Prisma.DepartmentFindManyArgs> => {
  const organizationId = await getOrgIdFilter(request.where?.organizationId);
  const orderBy = getOrderByClause(request);

  return {
    where: {
      id: request.where?.id,
      name: request.where?.name,
      organizationId,
    },
    orderBy,
    take: request.take,
  }
}

const getOrderByClause = (request: GetDepartmentsRequest) => {
  if (!request.orderBy) return {};

  return {
    ...request.orderBy.map(orderBy => ({
      [orderBy.field]: orderBy.direction ?? Prisma.SortOrder.asc,
    })),
  }
}