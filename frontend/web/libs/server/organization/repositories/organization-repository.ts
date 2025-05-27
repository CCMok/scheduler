import 'server-only'
import prisma from '../../_general/manager/database-manager'

export const findMany = async (incldueDepartments: boolean | undefined = false) => {
  return await prisma.organization.findMany({
    include: {
      departments: incldueDepartments,
    },
  })
}

export const findManyByUserId = async (userId: number, incldueDepartments: boolean | undefined = false) => {
  return await prisma.organization.findMany({
    where: { userOrganizations: { some: { userId } } },
    include: {
      departments: incldueDepartments,
    },
  })
}