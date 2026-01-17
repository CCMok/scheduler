import { getSession } from '@/libs/_general/session/session-manager'
import 'server-only'
import { Role } from './role'
import prisma from '@/libs/_general/database/database-manager'

export const checkCanAccessTeam = async (teamId: number): Promise<boolean> => {
  const session = await getSession()

  if (!session) return false
  if (session.roleId === Role.SYSTEM_ADMIN) return true

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
      ownerId: session.userId,
    },
  })

  return team !== null;
}