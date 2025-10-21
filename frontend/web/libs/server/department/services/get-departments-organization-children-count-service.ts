import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { DepartmentOrganizationChildrenCount } from '../models/department-dao';
import { GetDepartmentChildrenCountRequest, getDepartmentChildrenCountRequestSchema } from '../models/get-department-children-count-request';
import { cache } from 'react';
import { getDepartmentQuery } from '../utils/department-utils';

export const getDepartmentsOrganizationChildrenCountService = cache(async (request: GetDepartmentChildrenCountRequest): Promise<ServiceResponse<DepartmentOrganizationChildrenCount[]>> =>
  await serviceWrapper<DepartmentOrganizationChildrenCount[]>(async () => {
    const parsedRequest = getDepartmentChildrenCountRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetDepartmentChildrenCountRequest): Promise<DepartmentOrganizationChildrenCount[]> => {
  const query = await getDepartmentQuery(request);
  const isDeleted = request.where?.isDeleted ?? false;

  return await prisma.department.findMany({
    ...query,
    include: {
      organization: true,
      _count: {
        select: {
          workers: {
            where: { isDeleted },
          },
          posts: {
            where: { isDeleted },
          },
        },
      },
    },
  })
}