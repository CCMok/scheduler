import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Prisma } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { AccessResponse } from '../../access/models/access-response';
import { isNil } from 'lodash';
import { getAccessibleOrganizationIdsService } from '../../access/services/data-access-service';
import { DepartmentChildrenCount } from '../models/department-dao';
import { GetDepartmentChildrenCountsRequest, getDepartmentChildrenCountsRequestSchema } from '../models/get-department-children-counts-request';

export const getDepartmentChildrenCountsService = async (
  request: GetDepartmentChildrenCountsRequest
): Promise<ServiceResponse<DepartmentChildrenCount[]>> =>
  await serviceWrapper<DepartmentChildrenCount[]>(async () => {
    const parsedRequest = getDepartmentChildrenCountsRequestSchema.parse(request);

    const accessServiceResponse = await getAccessibleOrganizationIdsService();
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

    const query = getQuery(parsedRequest, accessServiceResponse.data);

    const departments = await prisma.department.findMany(query) as DepartmentChildrenCount[];

    return {
      status: ServiceResponseStatus.OK,
      data: departments,
    }
  })

const getQuery = (request: GetDepartmentChildrenCountsRequest, accessResponse: AccessResponse): Prisma.DepartmentFindManyArgs => {
  const where = getWhereClause(request, accessResponse);
  const include = getIncludeClause();

  return { where, include, take: request.take };
}

const getWhereClause = (request: GetDepartmentChildrenCountsRequest, accessResponse: AccessResponse): Prisma.DepartmentWhereInput => {
  const orgIdFilter = getOrgIdFilter(request, accessResponse);

  return {
    ...request.where,
    organizationId: orgIdFilter,
  }
}

const getOrgIdFilter = (request: GetDepartmentChildrenCountsRequest, accessResponse: AccessResponse) => {
  if (accessResponse.canAccessAll) {
    if (isNil(request.where?.organizationId)) return;
    return request.where.organizationId;
  }

  if (isNil(request.where?.organizationId)) return { in: accessResponse.ids };

  if (accessResponse.ids.includes(request.where.organizationId)) return request.where.organizationId;

  return { in: [] }
}

const getIncludeClause = (): Prisma.DepartmentInclude => {
  return {
    _count: {
      select: {
        workers: true,
        posts: true,
      },
    },
  }
}