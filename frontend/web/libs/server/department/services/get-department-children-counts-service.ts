import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
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

    const departments = await findEntity(parsedRequest, accessServiceResponse.data);

    return {
      status: ServiceResponseStatus.OK,
      data: departments,
    }
  })

const findEntity = async (request: GetDepartmentChildrenCountsRequest, accessResponse: AccessResponse): Promise<DepartmentChildrenCount[]> => {
  const orgIdFilter = getOrgIdFilter(request, accessResponse);

  return await prisma.department.findMany({
    where: {
      ...request.where,
      organizationId: orgIdFilter,
    },
    include: {
      _count: {
        select: {
          workers: {
            where: { isDeleted: false },
          },
          posts: {
            where: { isDeleted: false },
          },
        },
      },
    },
    take: request.take,
  })
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