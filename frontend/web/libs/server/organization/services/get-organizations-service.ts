import 'server-only'
import { getSession } from '../../_general/managers/session-manager';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { Organization, Prisma } from '@/external/prisma-generated';
import { Role } from '@/libs/share/_general/enums/role';
import prisma from '../../_general/managers/database-manager';
import { SessionPayload } from '../../_general/models/session-payload';

export const getOrganizationsService = async <T extends Organization = Organization>(
  queryOption: Prisma.OrganizationFindManyArgs = {}
): Promise<ServiceResponse<T[]>> => {
  const session = await getSession();
  if (!session) return { status: ServiceResponseStatus.UNAUTHORIZED }

  const query = getQuery(queryOption, session);

  const organizations = await prisma.organization.findMany(query) as T[];

  return {
    status: ServiceResponseStatus.OK,
    data: organizations,
  }
}

const getQuery = (queryOption: Prisma.OrganizationFindManyArgs, session: SessionPayload): Prisma.OrganizationFindManyArgs => {
  if (session.roleEnum === Role.SYSTEM_ADMIN) {
    return queryOption;
  }

  return {
    ...queryOption,
    where: {
      ...queryOption.where,
      userOrganizations: { some: { userId: session.userId } }
    }
  }
}