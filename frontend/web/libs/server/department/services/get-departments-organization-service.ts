import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { GetDepartmentsRequest, getDepartmentsRequestSchema } from '../models/get-departments-request';
import { DepartmentOrganization } from '../models/department-dao';
import { cache } from 'react';
import { getDepartmentQuery } from '../utils/department-utils';

export const getDepartmentsOrganizationService = cache(async (request: GetDepartmentsRequest): Promise<ServiceResponse<DepartmentOrganization[]>> =>
  await serviceWrapper<DepartmentOrganization[]>(async () => {
    const parsedRequest = getDepartmentsRequestSchema.parse(request);
    const entities = await findEntity(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntity = async (request: GetDepartmentsRequest): Promise<DepartmentOrganization[]> => {
  const query = await getDepartmentQuery(request);
  return await prisma.department.findMany({
    ...query,
    include: { organization: true },
  })
}