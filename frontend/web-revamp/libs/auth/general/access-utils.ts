import { getSession } from '@/libs/_general/session/session-manager'
import 'server-only'
import { Role } from './role'
import prisma from '@/libs/_general/database/database-manager'

export const checkCanAccessTeam = async (teamId: number): Promise<boolean> => {
  const session = await getSession()

  if (!session) return false
  if (session.role === Role.SYSTEM_ADMIN) return true

  const team = await prisma.team.findUnique({
    select: {
      id: true,
    },
    where: {
      id: teamId,
      ownerId: session.userId,
    },
  })

  return team !== null;
}

export const checkCanAccessRoster = async (rosterId: number): Promise<boolean> => {
  const session = await getSession()

  if (!session) return false
  if (session.role === Role.SYSTEM_ADMIN) return true

  const roster = await prisma.roster.findUnique({
    select: {
      teamId: true,
    },
    where: {
      id: rosterId,
    },
  })

  if (!roster) return false

  return await checkCanAccessTeam(roster.teamId);
}

export const checkCanAccessWorker = async (workerId: number): Promise<boolean> => {
  const session = await getSession()

  if (!session) return false
  if (session.role === Role.SYSTEM_ADMIN) return true

  const worker = await prisma.worker.findUnique({
    select: {
      id: true,
    },
    where: {
      id: workerId,
      team: {
        ownerId: session.userId,
      },
    },
  })

  return worker !== null;
}

export const checkCanAccessPost = async (postId: number): Promise<boolean> => {
  const session = await getSession()

  if (!session) return false
  if (session.role === Role.SYSTEM_ADMIN) return true

  const post = await prisma.post.findUnique({
    select: {
      id: true,
    },
    where: {
      id: postId,
      team: {
        ownerId: session.userId,
      },
    },
  })

  return post !== null;
}