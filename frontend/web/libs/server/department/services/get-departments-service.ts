import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Department } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { GetDepartmentsRequest, getDepartmentsRequestSchema } from '../models/get-departments-request';
import { cache } from 'react';
import { getDepartmentQuery } from '../utils/department-utils';

export const getDepartmentsService = cache(async (request: GetDepartmentsRequest): Promise<ServiceResponse<Department[]>> =>
  await serviceWrapper<Department[]>(async () => {
    const parsedRequest = getDepartmentsRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))
  
const findEntities = async (request: GetDepartmentsRequest): Promise<Department[]> => {
  const query = await getDepartmentQuery(request);
  return await prisma.department.findMany(query)
}