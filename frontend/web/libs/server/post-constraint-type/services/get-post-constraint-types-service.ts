import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';
import { GetPostConstraintTypesRequest, getPostConstraintTypesRequestSchema } from '../models/get-post-constraint-types-request';
import { PostConstraintType } from '@/external/prisma-generated';

export const getPostConstraintTypesService = cache(async (request: GetPostConstraintTypesRequest): Promise<ServiceResponse<PostConstraintType[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getPostConstraintTypesRequestSchema.parse(request);
    const entities = await findEntities(parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (request: GetPostConstraintTypesRequest): Promise<PostConstraintType[]> => {
  return await prisma.postConstraintType.findMany({
    where: {
      id: request.where?.id,
      name: request.where?.name,
      enum: request.where?.enum,
    },
    take: request.take,
  })
}