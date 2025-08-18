import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Organization, Prisma } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { GetOrganizationsRequest, getOrganizationsRequestSchema, OrganizationRelate } from '../models/get-organizations-request';
import { serviceWrapper } from '../../_general/services/general-service';
import { AccessResponse } from '../../access/models/access-response';
import { isNil } from 'lodash';
import { getAccessibleOrganizationIdsService } from '../../access/services/access-service';

export const getOrganizationsService = async <T extends Organization = Organization>(
  request: GetOrganizationsRequest
): Promise<ServiceResponse<T[]>> =>
  await serviceWrapper<T[]>(async () => {
    const parsedRequest = getOrganizationsRequestSchema.parse(request);

    const accessServiceResponse = await getAccessibleOrganizationIdsService();
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

    const query = getQuery(parsedRequest, accessServiceResponse.data);

    const organizations = await prisma.organization.findMany(query) as T[];

    return {
      status: ServiceResponseStatus.OK,
      data: organizations,
    }
  })

const getQuery = (request: GetOrganizationsRequest, accessResponse: AccessResponse): Prisma.OrganizationFindManyArgs => {
  const where = getWhereClause(request, accessResponse);
  const include = getIncludeClause(request);
  const orderBy = getOrderByClause(request, include);

  return { where, include, orderBy };
}

const getWhereClause = (request: GetOrganizationsRequest, accessResponse: AccessResponse) => {
  const idFilter = getIdFilter(request, accessResponse);

  return {
    ...request.where,
    id: idFilter,
  }
}

const getIdFilter = (request: GetOrganizationsRequest, accessResponse: AccessResponse) => {
  if (accessResponse.canAccessAll) {
    if (isNil(request.where?.id)) return;
    return request.where.id;
  }

  if (isNil(request.where?.id)) return { in: accessResponse.ids };

  if (accessResponse.ids.includes(request.where.id)) return request.where.id;

  return { in: [] }
}

const getIncludeClause = (request: GetOrganizationsRequest): Prisma.OrganizationInclude => {
  const include: Prisma.OrganizationInclude = {};

  if (!request.relate) return include;

  for (const relate of request.relate) {
    if (relate === OrganizationRelate.DEPARTMENT) {
      include.departments = true;
    }
  }

  return include;
}

const getOrderByClause = (request: GetOrganizationsRequest, include: Prisma.OrganizationInclude) => {
  const orderBy: Prisma.OrganizationOrderByWithRelationInput = {};

  if (!request.orderBy) return orderBy;

  for (const requestOrderBy of request.orderBy) {
    if (requestOrderBy.level === OrganizationRelate.DEPARTMENT) {
      if (include.departments) {
        include.departments = {
          orderBy: {
            [requestOrderBy.field]: requestOrderBy.direction ?? Prisma.SortOrder.asc,
          },
        }
      }
    } else {
      orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
    }
  }

  return orderBy;
}