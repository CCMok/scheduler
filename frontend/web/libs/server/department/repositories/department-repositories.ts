import 'server-only';
import prisma from "../../_general/managers/database-manager";

export const getDepartmentWorkersPosts = async (id: number) => {
  return await prisma.department.findUnique({
    where: { id },
    include: { workers: true, posts: true },
  })
}