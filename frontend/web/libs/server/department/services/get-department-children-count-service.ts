import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { DepartmentChildrenCount } from '../models/department-dao';
import { GetDepartmentChildrenCountRequest, getDepartmentChildrenCountRequestSchema } from '../models/get-department-children-count-request';
import { getOrgIdFilter } from '../../access/utils/data-access-utils';

export const getDepartmentChildrenCountService = async (
  request: GetDepartmentChildrenCountRequest
): Promise<ServiceResponse<DepartmentChildrenCount[]>> =>
  await serviceWrapper<DepartmentChildrenCount[]>(async () => {
    const parsedRequest = getDepartmentChildrenCountRequestSchema.parse(request);
    const departments = await findEntity(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: departments,
    }
  })

const findEntity = async (request: GetDepartmentChildrenCountRequest): Promise<DepartmentChildrenCount[]> => {
  const orgIdFilter = await getOrgIdFilter(request.where?.organizationId);

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