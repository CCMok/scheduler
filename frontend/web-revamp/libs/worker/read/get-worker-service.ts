import 'server-only';
import { cache } from "react";
import { Prisma, Worker } from '@/external/prisma/generated/client';
import { getSession } from '@/libs/_general/session/session-manager';
import prisma from '@/libs/_general/database/database-manager';
import { Role } from '@/libs/auth/authorization/role';
import { getTeams } from '@/libs/team/read/get-team-service';

export const getWorkers = cache(async (teamId: number): Promise<Worker[]> => {
  const session = await getSession();
  if (!session) return [];

  try {
    return await prisma.worker.findMany({
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
    console.error('Fail to get workers');
    console.error(e);
    return [];
  }
})

export const getFirstTeamWorkers = cache(async (): Promise<Worker[]> => {
  const teams = await getTeams();
  if (!teams.length) return [];

  try {
    return await prisma.worker.findMany({
      where: {
        teamId: teams[0].id,
      },
    })
  } catch (e) {
    console.error('Fail to get first team workers');
    console.error(e);
    return [];
  }
})