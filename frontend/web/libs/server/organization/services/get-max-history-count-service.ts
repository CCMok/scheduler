import 'server-only'
import { GetMaxHistoryCountResponse } from "../models/get-max-history-count-response";
import { cache } from 'react';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import prisma from '../../_general/managers/database-manager';
import { Organization } from '@/external/prisma-generated';
import { MessageContent } from '../../_general/enums/message';
import { checkCanAccessOrganization } from '../utils/access-organization-utils';
import { isNil } from 'lodash';

export const getMaxHistoryCountService = cache(tryCatch(async (
  departmentId: number,
): Promise<ServiceResponse<GetMaxHistoryCountResponse>> => {
  const entity = await findEntity(departmentId);
  if (!entity) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '機構'),
  }

  const canAccess = await checkCanAccessOrganization(entity.id);
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '機構'),
  }

  return {
    status: ServiceResponseStatus.OK,
    data: isNil(entity.maxHistoryCount) ? undefined : entity.maxHistoryCount,
  }
}))

const findEntity = async (departmentId: number): Promise<Organization | null> => {
  return await prisma.organization.findFirst({
    where: {
      departments: {
        some: {
          id: departmentId,
        },
      },
    },
  })
}