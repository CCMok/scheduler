import 'server-only'
import prisma from '../../_general/manager/database-manager'

export const findUserByEmail = async (email: string, incldueRole: boolean | undefined = false) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      role: incldueRole,
    },
  })
}