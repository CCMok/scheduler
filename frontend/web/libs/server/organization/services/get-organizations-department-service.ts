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
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetOrganizationsDeparmentRequest): Promise<OrganizationDepartments[]> => {
  const query = await getOrganizationQuery(request);
  const departments = getDepartmentIncludeClause(request);

  return await prisma.organization.findMany({
    ...query,
    include: { departments },
  })
}

const getDepartmentIncludeClause = (request: GetOrganizationsDeparmentRequest): boolean | Prisma.Organization$departmentsArgs => {
  if (!request.department?.orderBys?.length) return true;

  return {
    orderBy: Object.fromEntries(
      request.department.orderBys.map(orderBy => [
        orderBy.field,
        orderBy.direction ?? Prisma.SortOrder.asc
      ])
    ),
  }
}