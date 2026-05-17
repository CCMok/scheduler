import 'server-only';
import { cache } from "react";
import { Prisma, Post, PostWorker as PrismaPostWorker, Worker } from '@/external/prisma/generated/client';
import { getSession } from '@/libs/_general/session/session-manager';
import prisma from '@/libs/_general/database/database-manager';
import { Role } from '@/libs/auth/general/role';
import { PostStatus } from '../post-status';
import { PostWorker } from '../post';

export const getPosts = cache(async (teamId: number, activeOnly: boolean = false): Promise<PostWorker[]> => {
  const session = await getSession();
  if (!session) return [];

  let posts: (Post & { workers: (PrismaPostWorker & { worker: Worker })[] })[] = [];
  try {
    posts = await prisma.post.findMany({
      where: {
        teamId,
        status: activeOnly ? PostStatus.ACTIVE : undefined, 
        team: {
          ownerId: session.role === Role.SYSTEM_ADMIN ? undefined : session.userId,
        },
      },
      include: {
        workers: {
          include: {
            worker: true,
          },
        }
      },
      orderBy: {
        name: Prisma.SortOrder.asc,
      }
    })
  } catch (e) {
    console.error('Fail to get posts');
    console.error(e);
    return [];
  }

  return posts.map(p => ({
    ...p,
    workers: p.workers.map(w => w.worker),
  }))
})