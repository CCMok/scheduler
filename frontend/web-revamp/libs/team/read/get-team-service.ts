import { Prisma, Team } from '@/external/prisma/generated/client'
import prisma from '@/libs/_general/database/database-manager'
import { getSession } from '@/libs/_general/session/session-manager'
import { Role } from '@/libs/auth/authorization/role'
import { cache } from 'react'
import 'server-only'

export const getTeams = cache(async (): Promise<Team[]> => {
  const session = await getSession();
  if (!session) return []

  try {
    return await prisma.team.findMany({
      where: {
        ownerId: session.roleId === Role.SYSTEM_ADMIN ? undefined : session.userId,
      },
      orderBy: {
        name: Prisma.SortOrder.asc,
      },
    })
  } catch (e) {
    console.error('Fail to get teams');
    console.error(e);
    return []
  }
})

export const getTeamById = cache(async (id: number): Promise<Team | undefined> => {
  const session = await getSession();
  if (!session) return undefined

  try {
    const team = await prisma.team.findUnique({
      where: { id },
    })
  
    if (!team || (session.roleId !== Role.SYSTEM_ADMIN && team.ownerId !== session.userId))
      return undefined
  
    return team
  } catch (e) {
    console.error('Fail to get team by id');
    console.error(e);
    return undefined;
  }
})