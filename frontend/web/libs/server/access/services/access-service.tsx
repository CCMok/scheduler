import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import 'server-only'
import { serviceWrapper } from '../../_general/services/general-service'
import { getSession } from '../../_general/managers/session-manager';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { cache } from 'react';
import { Role } from '@/libs/share/_general/enums/role';
import prisma from '../../_general/managers/database-manager';

export const getAccessibleOrganizationIdsService = cache(async (): Promise<ServiceResponse<number[]>> =>
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
      select: { organizationId: true },
      where: { userId: session.userId },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: userOrganizations.map(userOrganization => userOrganization.organizationId),
    }
  })
)

export const getAccessibleDepartmentIdsService = cache(async (): Promise<ServiceResponse<number[]>> =>
  await serviceWrapper<number[]>(async () => {
    const parentResponse = await getAccessibleOrganizationIdsService();
    if (parentResponse.status !== ServiceResponseStatus.OK) return parentResponse;

    const departments = await prisma.department.findMany({
      select: { id: true },
      where: {
        organizationId: { in: parentResponse.data },
      },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: departments.map(department => department.id),
    }
  })
)

export const getAccessiblePostIdsService = cache(async (): Promise<ServiceResponse<number[]>> =>
  await serviceWrapper<number[]>(async () => {
    const parentResponse = await getAccessibleDepartmentIdsService();
    if (parentResponse.status !== ServiceResponseStatus.OK) return parentResponse;

    const posts = await prisma.post.findMany({
      select: { id: true },
      where: {
        departmentId: { in: parentResponse.data },
      },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: posts.map(post => post.id),
    }
  })
)

export const getAccessibleWorkerIdsService = cache(async (): Promise<ServiceResponse<number[]>> =>
  await serviceWrapper<number[]>(async () => {
    const parentResponse = await getAccessibleDepartmentIdsService();
    if (parentResponse.status !== ServiceResponseStatus.OK) return parentResponse;

    const worker = await prisma.worker.findMany({
      select: { id: true },
      where: {
        departmentId: { in: parentResponse.data },
      },
    })

    return {
      status: ServiceResponseStatus.OK,
      data: worker.map(worker => worker.id),
    }
  })
)