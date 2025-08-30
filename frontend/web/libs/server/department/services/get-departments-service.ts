import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Department, Prisma } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { AccessResponse } from '../../access/models/access-response';
import { isNil } from 'lodash';
import { getAccessibleOrganizationIdsService } from '../../access/services/data-access-service';
import { GetDepartmentsRequest, getDepartmentsRequestSchema } from '../models/get-department-request';

export const getDepartmentsService = async <T extends Department = Department>(
  request: GetDepartmentsRequest
): Promise<ServiceResponse<T[]>> =>
  await serviceWrapper<T[]>(async () => {
    const parsedRequest = getDepartmentsRequestSchema.parse(request);

    const accessServiceResponse = await getAccessibleOrganizationIdsService();
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

    const query = getQuery(parsedRequest, accessServiceResponse.data);

    const departments = await prisma.department.findMany(query) as T[];

    return {
      status: ServiceResponseStatus.OK,
      data: departments,
    }
  })

const getQuery = (request: GetDepartmentsRequest, accessResponse: AccessResponse): Prisma.DepartmentFindManyArgs => {
  const where = getWhereClause(request, accessResponse);
  const orderBy = getOrderByClause(request);

  return { where, orderBy, take: request.take };
}

const getWhereClause = (request: GetDepartmentsRequest, accessResponse: AccessResponse): Prisma.DepartmentWhereInput => {
  const orgIdFilter = getOrgIdFilter(request, accessResponse);

  return {
    ...request.where,
    organizationId: orgIdFilter,
  }
}

const getOrgIdFilter = (request: GetDepartmentsRequest, accessResponse: AccessResponse) => {
  if (accessResponse.canAccessAll) {
    if (isNil(request.where?.organizationId)) return;
    return request.where.organizationId;
  }

  if (isNil(request.where?.organizationId)) return { in: accessResponse.ids };

  if (accessResponse.ids.includes(request.where.organizationId)) return request.where.organizationId;

  return { in: [] }
}

const getOrderByClause = (request: GetDepartmentsRequest) => {
  const orderBy: Prisma.DepartmentOrderByWithRelationInput = {};

  if (!request.orderBy) return orderBy;

  for (const requestOrderBy of request.orderBy) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}