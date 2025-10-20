import 'server-only'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import prisma from '../../_general/managers/database-manager';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';
import { RosterHistoryRelated } from '../models/roster-history-dao';
import { getSession } from '../../_general/managers/session-manager';
import { SessionPayload } from '../../_general/models/session-payload';
import { Role } from '@/libs/share/_general/enums/role';
import { Prisma } from '@/external/prisma-generated';
import { GetRosterHistoriesRequest, getRosterHistoriesRequestSchema } from '../models/get-roster-histories-request';

export const getRosterHistoriesService = cache(async (request: GetRosterHistoriesRequest): Promise<ServiceResponse<RosterHistoryRelated[]>> =>
  await serviceWrapper<RosterHistoryRelated[]>(async () => {
    const parsedRequest = getRosterHistoriesRequestSchema.parse(request)

    const session = await getSession();
    if (!session) return {
      status: ServiceResponseStatus.UNAUTHORIZED,
    }

    const entities = await findEntities(session, parsedRequest);

    return {
      status: ServiceResponseStatus.OK,
      data: entities,
    }
  }))

const findEntities = async (session: SessionPayload, request: GetRosterHistoriesRequest): Promise<RosterHistoryRelated[]> => { 
  const userOrganizationWhereClause = getOrganizationWhereClause(session);
  return await prisma.rosterHistory.findMany({
    where: {
      id: request.where?.id,
      department: {
        organization: {
          ...userOrganizationWhereClause,
        },
      },
    },
    include: {
      department: {
        include: {
          organization: true,
        },
      },
      createdByUser: {
        omit: {
          password: true,
        },
      },
    },
  });
}

const getOrganizationWhereClause = (session: SessionPayload): Prisma.OrganizationWhereInput => {
  if (session.roleEnum === Role.SYSTEM_ADMIN) return {};
  return {
    userOrganizations: {
      some: {
        userId: session.userId,
      },
    },
  }
}