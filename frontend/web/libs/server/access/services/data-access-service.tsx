import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import 'server-only'
import { serviceWrapper } from '../../_general/services/general-service'
import { getSession } from '../../_general/managers/session-manager';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { cache } from 'react';
import { Role } from '@/libs/share/_general/enums/role';
import prisma from '../../_general/managers/database-manager';
import { AccessResponse } from '../models/access-response';

export const getAccessibleOrgIdsService = cache(async (): Promise<ServiceResponse<AccessResponse>> =>
  await serviceWrapper<AccessResponse>(async () => {
    const session = await getSession();
    if (!session) return { status: ServiceResponseStatus.UNAUTHORIZED }

    if (session.roleEnum === Role.SYSTEM_ADMIN) {
      return {
        status: ServiceResponseStatus.OK,
        data: {
          canAccessAll: true,
          ids: [],
        },
      }
    }

    const userOrganizations = await prisma.userOrganization.findMany({
      select: { organizationId: true },
      where: { userId: session.userId },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {
        canAccessAll: false,
        ids: userOrganizations.map(userOrganization => userOrganization.organizationId),
      },
    }
  })
)

export const getAccessibleDeptIdsService = cache(async (): Promise<ServiceResponse<AccessResponse>> =>
  await serviceWrapper<AccessResponse>(async () => {
    const parentResponse = await getAccessibleOrgIdsService();
    if (parentResponse.status !== ServiceResponseStatus.OK || parentResponse.data.canAccessAll) {
      return parentResponse;
    }

    const departments = await prisma.department.findMany({
      select: { id: true },
      where: {
        organizationId: { in: parentResponse.data.ids },
      },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {
        canAccessAll: false,
        ids: departments.map(department => department.id),
      },
    }
  })
)

export const getAccessiblePostIdsService = cache(async (): Promise<ServiceResponse<AccessResponse>> =>
  await serviceWrapper<AccessResponse>(async () => {
    const parentResponse = await getAccessibleDeptIdsService();
    if (parentResponse.status !== ServiceResponseStatus.OK || parentResponse.data.canAccessAll) {
      return parentResponse;
    }

    const posts = await prisma.post.findMany({
      select: { id: true },
      where: {
        departmentId: { in: parentResponse.data.ids },
      },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {
        canAccessAll: false,
        ids: posts.map(post => post.id),
      },
    }
  })
)

export const getAccessibleWorkerIdsService = cache(async (): Promise<ServiceResponse<AccessResponse>> =>
  await serviceWrapper<AccessResponse>(async () => {
    const parentResponse = await getAccessibleDeptIdsService();
    if (parentResponse.status !== ServiceResponseStatus.OK || parentResponse.data.canAccessAll) {
      return parentResponse;
    }

    const worker = await prisma.worker.findMany({
      select: { id: true },
      where: {
        departmentId: { in: parentResponse.data.ids },
      },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: {
        canAccessAll: false,
        ids: worker.map(worker => worker.id),
      },
    }
  })
)