import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import 'server-only'
import { serviceWrapper } from '../../_general/services/general-service'
import { getSession } from '../../_general/managers/session-manager';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { cache } from 'react';
import { Role } from '@/libs/share/_general/enums/role';
import prisma from '../../_general/managers/database-manager';

export const getAccessibleOrganizationsService = cache(async (): Promise<ServiceResponse<number[]>> =>
  await serviceWrapper<number[]>(async () => {
    const session = await getSession();
    if (!session) return { status: ServiceResponseStatus.UNAUTHORIZED }

    if (session.roleEnum === Role.SYSTEM_ADMIN) {
      const organizations = await prisma.organization.findMany({
        select: { id: true },
      })

      return {
        status: ServiceResponseStatus.OK,
        data: organizations.map(organization => organization.id),
      }
    }

    const userOrganizations = await prisma.userOrganization.findMany({
      where: { userId: session.userId },
      select: { organizationId: true },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: userOrganizations.map(userOrganization => userOrganization.organizationId),
    }
  })
)

// TOOD: get department, post, worker access