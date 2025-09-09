import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Department, Prisma } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { DepartmentRelate, GetDepartmentsRequest, getDepartmentsRequestSchema } from '../models/get-departments-request';
import { getOrgIdFilter } from '../../access/utils/data-access-utils';

export const getDepartmentsService = async <T extends Department = Department>(
  request: GetDepartmentsRequest
): Promise<ServiceResponse<T[]>> =>
  await serviceWrapper<T[]>(async () => {
    const parsedRequest = getDepartmentsRequestSchema.parse(request);
    const query = await getQuery(parsedRequest);
    const departments = await prisma.department.findMany(query) as T[];

    return {
      status: ServiceResponseStatus.OK,
      data: departments,
    }
  })

const getQuery = async (request: GetDepartmentsRequest): Promise<Prisma.DepartmentFindManyArgs> => {
  const where = await getWhereClause(request);
  const include = getIncludeClause(request);
  const orderBy = getOrderByClause(request);

  return { where, include, orderBy, take: request.take };
}

const getWhereClause = async (request: GetDepartmentsRequest): Promise<Prisma.DepartmentWhereInput> => {
  const orgIdFilter = await getOrgIdFilter(request.where?.organizationId);

  return {
    ...request.where,
    organizationId: orgIdFilter,
  }
}

const getIncludeClause = (request: GetDepartmentsRequest): Prisma.DepartmentInclude => {
  const include: Prisma.DepartmentInclude = {};

  if (!request.relate) return include;

  for (const relate of request.relate) {
    if (relate === DepartmentRelate.ORGANIZATION) {
      include.organization = true;
    }
  }

  return include;
}

const getOrderByClause = (request: GetDepartmentsRequest) => {
  const orderBy: Prisma.DepartmentOrderByWithRelationInput = {};

  if (!request.orderBy) return orderBy;

  for (const requestOrderBy of request.orderBy) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}