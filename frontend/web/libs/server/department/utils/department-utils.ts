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
  const orderBy: Prisma.DepartmentOrderByWithRelationInput = {};

  if (!request.orderBy) return orderBy;

  for (const requestOrderBy of request.orderBy) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}