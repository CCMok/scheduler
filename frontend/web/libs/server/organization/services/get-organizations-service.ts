import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Organization, Prisma } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { GetOrganizationsRequest, getOrganizationsRequestSchema, OrganizationRelate } from '../models/get-organizations-request';
import { serviceWrapper } from '../../_general/services/general-service';
import { getOrgIdFilter } from '../../access/utils/data-access-utils';

export const getOrganizationsService = async <T extends Organization = Organization>(
  request: GetOrganizationsRequest
): Promise<ServiceResponse<T[]>> =>
  await serviceWrapper<T[]>(async () => {
    const parsedRequest = getOrganizationsRequestSchema.parse(request);
    const query = await getQuery(parsedRequest);
    const entities = await prisma.organization.findMany(query) as T[];

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  })

const getQuery = async (request: GetOrganizationsRequest): Promise<Prisma.OrganizationFindManyArgs> => {
  const where = await getWhereClause(request);
  const include = getIncludeClause(request);
  const orderBy = getOrderByClause(request, include);

  return { where, include, orderBy, take: request.take };
}

const getWhereClause = async (request: GetOrganizationsRequest): Promise<Prisma.OrganizationWhereInput> => {
  const id = await getOrgIdFilter(request.where?.id);

  return {
    ...request.where,
    id,
  }
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