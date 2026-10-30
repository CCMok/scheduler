import 'server-only'
import { cache } from 'react'
import { Prisma } from '@/external/prisma/generated/client'
import prisma from '@/libs/_general/database/database-manager'
import { getSession } from '@/libs/_general/session/session-manager'
import { Role } from '@/libs/auth/general/role'
import { PostAffinityGroup, WorkerAffinityGroup } from '../affinity'

export const getPostAffinities = cache(async (teamId: number): Promise<PostAffinityGroup[]> => {
  const session = await getSession()
  if (!session) return []

  try {
    const rows = await prisma.postAffinity.findMany({
      where: {
        teamId,
        team: {
          ownerId: session.role === Role.SYSTEM_ADMIN ? undefined : session.userId,
        },
      },
      include: {
        members: {
          include: { post: true },
        },
      },
      orderBy: { id: Prisma.SortOrder.asc },
    })

    return rows.map((row) => ({
      id: row.id,
      teamId: row.teamId,
      members: row.members
        .map((m) => m.post)
        .toSorted((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name)),
    }))
  } catch (e) {
    console.error('Fail to get post affinities')
    console.error(e)
    return []
  }
})

export const getWorkerAffinities = cache(async (teamId: number): Promise<WorkerAffinityGroup[]> => {
  const session = await getSession()
  if (!session) return []

  try {
    const rows = await prisma.workerAffinity.findMany({
      where: {
        teamId,
        team: {
          ownerId: session.role === Role.SYSTEM_ADMIN ? undefined : session.userId,
        },
      },
      include: {
        members: {
          include: { worker: true },
        },
      },
      orderBy: { id: Prisma.SortOrder.asc },
    })

    return rows.map((row) => ({
      id: row.id,
      teamId: row.teamId,
      members: row.members
        .map((m) => m.worker)
        .toSorted((a, b) => a.name.localeCompare(b.name)),
    }))
  } catch (e) {
    console.error('Fail to get worker affinities')
    console.error(e)
    return []
  }
})
