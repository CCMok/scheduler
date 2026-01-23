import 'server-only';
import { cache } from "react";
import { Prisma, Post } from '@/external/prisma/generated/client';
import { getSession } from '@/libs/_general/session/session-manager';
import prisma from '@/libs/_general/database/database-manager';
import { Role } from '@/libs/auth/authorization/role';
import { getTeams } from '@/libs/team/read/get-team-service';

export const getPosts = cache(async (teamId: number): Promise<Post[]> => {
  const session = await getSession();
  if (!session) return [];

  try {
    return await prisma.post.findMany({
      where: {
        teamId,
        team: {
          ownerId: session.roleId === Role.SYSTEM_ADMIN ? undefined : session.userId,
        },
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
})

export const getFirstTeamPosts = cache(async (): Promise<Post[]> => {
  const teams = await getTeams();
  if (!teams.length) return [];

  try {
    return await prisma.post.findMany({
      where: {
        teamId: teams[0].id,
      }
    })
  } catch (e) {
    console.error('Fail to get first team posts');
    console.error(e);
    return [];
  }
})