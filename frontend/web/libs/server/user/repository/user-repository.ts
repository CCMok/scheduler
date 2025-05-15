import 'server-only'
import prisma from '../../_general/manager/database-manager'

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  })
}