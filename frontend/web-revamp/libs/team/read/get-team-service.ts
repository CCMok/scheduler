import { Prisma, Team } from '@/external/prisma/generated/client'
import prisma from '@/libs/_general/database/database-manager'
import { ServiceResponse } from '@/libs/_general/service/response'
import { tryCatch } from '@/libs/_general/service/try-catch'
import { getSession } from '@/libs/_general/session/session-manager'
import { Role } from '@/libs/auth/role/role'
import { cache } from 'react'
import 'server-only'

export const getTeams = cache(async (): Promise<ServiceResponse<Team[]>> => {
  const session = await getSession();
  if (!session) return {
    isSuccess: true,
    data: [],
  }

  return await doGetTeams(session.roleId, session.userId);  
})

const doGetTeams = tryCatch(async (roleId: number, userId: number): Promise<ServiceResponse<Team[]>> => {
  const teams = await prisma.team.findMany({
    where: {
      ownerId: roleId === Role.SYSTEM_ADMIN ? undefined : userId,
    },
    orderBy: {
      name: Prisma.SortOrder.asc,
    },
  })

  return {
    isSuccess: true,
    data: teams,
  }
})