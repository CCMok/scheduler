import 'server-only'
import { cache } from "react";
import prisma from '@/libs/_general/database/database-manager';
import { Prisma, Roster } from '@/external/prisma/generated/client';
import { getTeams } from '@/libs/team/read/get-team-service';
import { RosterJoin } from '../roster';

export const getFirstTeamRosters = cache(async (): Promise<Roster[]> => {
  const teams = await getTeams();
  const teamId = teams[0]?.id;
  if (!teamId) return []

  try {
    return await prisma.roster.findMany({
      where: { teamId },
      orderBy: { createdAt: Prisma.SortOrder.desc }
    })
  } catch (e) {
    console.error('Fail to get rosters by team id');
    console.error(e);
    return []
  }
})

export const getFirstRoster = cache(async (): Promise<RosterJoin | undefined> => {
  const rosters = await getFirstTeamRosters();
  if (!rosters.length) return;

  try {
    const roster = await prisma.roster.findUnique({
      where: { id: rosters[0]?.id },
      include: {
        timeslots: {
          include: {
            assignments: true,
          },
        },
      },
    })
    return roster ?? undefined;
  } catch (e) {
    console.error('Fail to get first roster');
    console.error(e);
  }
})