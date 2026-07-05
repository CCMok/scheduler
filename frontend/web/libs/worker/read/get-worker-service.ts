import 'server-only';
import { cache } from "react";
import { Worker, Post, PostWorker, Prisma } from '@/external/prisma/generated/client';
import { getSession } from '@/libs/_general/session/session-manager';
import prisma from '@/libs/_general/database/database-manager';
import { Role } from '@/libs/auth/general/role';
import { WorkerPost } from '../worker';
import { WorkerStatus } from '../worker-status';

export const getWorkers = cache(async (teamId: number, activeOnly: boolean = false): Promise<WorkerPost[]> => {
  const session = await getSession();
  if (!session) return [];

  let workers: (Worker & { posts: (PostWorker & { post: Post })[] })[] = [];
  try {
    workers = await prisma.worker.findMany({
      where: {
        teamId,
        status: activeOnly ? WorkerStatus.ACTIVE : undefined,
        team: {
          ownerId: session.role === Role.SYSTEM_ADMIN ? undefined : session.userId,
        },
      },
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
      orderBy: {
        name: Prisma.SortOrder.asc,
      }
    })
  } catch (e) {
    console.error('Fail to get workers');
    console.error(e);
    return [];
  }

  return workers.map(w => ({
    ...w,
    posts: w.posts.map(p => p.post),
  }))
})