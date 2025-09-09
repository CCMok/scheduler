import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { OrganizationDepartments } from '../models/organization-dao';
import { cache } from 'react';
import { getOrganizationQuery } from '../utils/organization-utils';
import { GetOrganizationsDeparmentRequest, getOrganizationsDeparmentRequestSchema } from '../models/get-organizations-department-request';
import { Prisma } from '@/external/prisma-generated';

export const getOrganizationsDepartmentService = cache(async (request: GetOrganizationsDeparmentRequest): Promise<ServiceResponse<OrganizationDepartments[]>> =>
  await serviceWrapper<OrganizationDepartments[]>(async () => {
    const parsedRequest = getOrganizationsDeparmentRequestSchema.parse(request);
    const entities = await findEntity(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntity = async (request: GetOrganizationsDeparmentRequest): Promise<OrganizationDepartments[]> => {
  const query = await getOrganizationQuery(request);
  const departmentInclude = getDepartmentIncludeClause(request);

  return await prisma.organization.findMany({
    ...query,
    include: { departments: departmentInclude },
  })
}

const getDepartmentIncludeClause = (request: GetOrganizationsDeparmentRequest): boolean | Prisma.Organization$departmentsArgs => {
  if (!request.department?.orderBy?.length) return true;

  const clause: Prisma.Organization$departmentsArgs = { orderBy: {} };

  // TODO continue
  for (const requestOrderBy of request.department.orderBy) {
    clause.orderBy?[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return clause;
}