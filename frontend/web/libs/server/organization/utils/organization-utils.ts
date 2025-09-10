import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { isNil } from 'lodash';
import { getOrgIdFilter } from '../../access/utils/data-access-utils';
import { GetOrganizationsRequest } from '../models/get-organizations-request';
import { Prisma } from '@/external/prisma-generated';

export const getMaxHistoryCount = async (deptId: number): Promise<number | undefined> => {
  const id = await getOrgIdFilter(undefined);

  const entity = await prisma.organization.findFirst({
    where: {
      id,
      departments: {
        some: {
          id: deptId,
        },
      },
    },
    select: {
      maxHistoryCount: true,
    }
  })

  return isNil(entity?.maxHistoryCount) ? undefined : entity.maxHistoryCount;
}

export const getOrganizationQuery = async (request: GetOrganizationsRequest): Promise<Prisma.OrganizationFindManyArgs> => {
  const id = await getOrgIdFilter(request.where?.id);
  const orderBy = getOrderByClause(request);

  return {
    where: {
      id,
      name: request.where?.name,
      maxHistoryCount: request.where?.maxHistoryCount,
    },
    orderBy,
    take: request.take,
  }
}

const getOrderByClause = (request: GetOrganizationsRequest): Prisma.OrganizationOrderByWithRelationInput => {
  const orderBy: Prisma.OrganizationOrderByWithRelationInput = {};

  if (!request.orderBys) return orderBy;

  for (const requestOrderBy of request.orderBys) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}