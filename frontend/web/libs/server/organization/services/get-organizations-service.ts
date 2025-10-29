import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Organization } from '@/external/prisma-generated';
import prisma from '../../_general/managers/database-manager';
import { GetOrganizationsRequest, getOrganizationsRequestSchema } from '../models/get-organizations-request';
import { serviceWrapper } from '../../_general/services/general-service';
import { getOrganizationQuery } from '../utils/organization-utils';
import { cache } from 'react';

export const getOrganizationsService = cache(async (request: GetOrganizationsRequest): Promise<ServiceResponse<Organization[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getOrganizationsRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetOrganizationsRequest): Promise<Organization[]> => {
  const query = await getOrganizationQuery(request);
  return await prisma.organization.findMany(query);
}

export const getAllOrganizationsService = cache(async (): Promise<ServiceResponse<Organization[]>> => 
  await serviceWrapper(async () => {
    const entities = await findEntities({
      orderBys: [{ field: 'name' }],
    });

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  })
)