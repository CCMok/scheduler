import 'server-only'
import { cache } from "react";
import prisma from '@/libs/_general/database/database-manager';
import { Prisma, Roster } from '@/external/prisma/generated/client';

export const getRosters = cache(async (teamId: number): Promise<Roster[]> => {
  try {
    return await prisma.roster.findMany({
      where: { teamId },
      orderBy: { createdAt: Prisma.SortOrder.desc },
    });
  } catch (e) {
    console.error('Fail to get rosters by team id');
    console.error(e);
    return [];
  }
});

// TODO
export const getRosterById = cache(async (rosterId: number): Promise<Roster | undefined> => {
  try {
    const roster = await prisma.roster.findUnique({
      where: { id: rosterId },
      // TODO
      // include: {
      //   timeslots: {
      //     include: {
      //       assignments: true,
      //     },
      //   },
      // },
    });
    return roster ?? undefined;
  } catch (e) {
    console.error('Fail to get roster by id');
    console.error(e);
    return undefined;
  }
});