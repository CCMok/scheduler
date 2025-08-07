import 'server-only'
import { getSession } from '../../_general/managers/session-manager';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Organization, Prisma } from '@/external/prisma-generated';
import { Role } from '@/libs/share/_general/enums/role';
import prisma from '../../_general/managers/database-manager';
import { SessionPayload } from '../../_general/models/session-payload';
import { GetOrganizationsRequest, OrganizationRelate } from '../models/get-organizations-request';
import { serviceWrapper } from '../../_general/services/general-service';

export const getOrganizationsService = async <T extends Organization = Organization>(
  request: GetOrganizationsRequest
): Promise<ServiceResponse<T[]>> =>
  await serviceWrapper<T[]>(async () => {
    const session = await getSession();
    if (!session) return { status: ServiceResponseStatus.UNAUTHORIZED }

    const query = getQuery(request, session);

    const organizations = await prisma.organization.findMany(query) as T[];

    return {
      status: ServiceResponseStatus.OK,
      data: organizations,
    }
  })

const getQuery = (request: GetOrganizationsRequest, session: SessionPayload): Prisma.OrganizationFindManyArgs => {
  const where: Prisma.OrganizationWhereInput = request.where ? { ...request.where } : {};

  const include = getIncludeQuery(request);

  const orderBy: Prisma.OrganizationOrderByWithRelationInput = {};
  if (request.orderBy) {
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
  }

  const query: Prisma.OrganizationFindManyArgs = { where, include, orderBy };

  return getRoleBaseQuery(session, query);
}

const getIncludeQuery = (request: GetOrganizationsRequest): Prisma.OrganizationInclude => {
  const include: Prisma.OrganizationInclude = {};

  if (request.relate) {
    for (const relate of request.relate) {
      if (relate === OrganizationRelate.DEPARTMENT) {
        include.departments = true;
      }
    }
  }

  return include;
}

const getRoleBaseQuery = (session: SessionPayload, query: Prisma.OrganizationFindManyArgs): Prisma.OrganizationFindManyArgs => {
  if (session.roleEnum === Role.SYSTEM_ADMIN) {
    return query;
  }

  return {
    ...query,
    where: {
      ...query.where,
      userOrganizations: { some: { userId: session.userId } }
    }
  }
}