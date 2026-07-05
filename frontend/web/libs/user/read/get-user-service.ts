import prisma from '@/libs/_general/database/database-manager'
import { getSession } from '@/libs/_general/session/session-manager'
import { cache } from 'react'
import 'server-only'

export const getUserName = cache(async (): Promise<string | undefined> => {
  const session = await getSession();
  if (!session) return

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true },
    })
    return user?.name ?? undefined
  } catch (e) {
    console.error('Fail to get user name');
    console.error(e);
  }
})
