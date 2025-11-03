import 'server-only';
import prisma from "../../_general/managers/database-manager";
import { Prisma } from '@/external/prisma-generated';
import { cache } from 'react';
import { UserExcludePasswordWithRole } from '../models/user-dao';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const getUsersWithRoleService = cache(tryCatch(async (
  id?: number,
  email?: string,
  name?: string,
  roleId?: number,
): Promise<ServiceResponse<UserExcludePasswordWithRole[]>> => {
  const entities = await findEntities(id, email, name, roleId);
  return {
    status: ServiceResponseStatus.OK,
    data: entities,
  }
}))

const findEntities = async (
  id?: number,
  email?: string,
  name?: string,
  roleId?: number,
): Promise<UserExcludePasswordWithRole[]> => {
  return await prisma.user.findMany({
    omit: {
      password: true,
    },
    where: {
      id,
      email,
      name,
      roleId,
    },
    include: {
      role: true,
    },
    orderBy: {
      email: Prisma.SortOrder.asc,
    },
  })
}