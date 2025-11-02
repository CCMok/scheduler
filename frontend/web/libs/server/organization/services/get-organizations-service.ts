import 'server-only'
import { Organization, Prisma } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { cache } from 'react';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { filterAccessibleOrganizations } from '../utils/access-organization-utils';
import { isNil } from 'lodash';

export const getOrganizationsService = cache(tryCatch(async (
  id?: number,
  name?: string,
  userId?: number,
): Promise<ServiceResponse<Organization[]>> => {
  const entities = await findEntities(id, name, userId);
  const filteredEntities = await filterAccessibleOrganizations(entities, entity => entity.id)
  return {
    status: ServiceResponseStatus.OK,
    data: filteredEntities,
  }
}))

const findEntities = async (
  id?: number,
  name?: string,
  userId?: number,
): Promise<Organization[]> => {
  const userIdWhereClause = getUserIdWhereClause(userId);
  return await prisma.organization.findMany({
    where: {
      id,
      name,
      ...userIdWhereClause,
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })
}

const getUserIdWhereClause = (userId?: number): Prisma.OrganizationWhereInput => {
  if (isNil(userId)) return {};
  return {
    userOrganizations: {
      some: { userId },
    },
  }
}