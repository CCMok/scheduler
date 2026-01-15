import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { RosterDto, RosterPostAssignment } from "../../roster";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { getSession } from '@/libs/_general/session/session-manager';
import { Message } from '@/libs/_general/service/message';
import { Role } from '@/libs/auth/role/role';
import prisma from '@/libs/_general/database/database-manager';
import { AutoCreateRosterRequest, autoCreateRosterRequestSchema } from './auto-create-roster-request';
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from './sch-arrange-roster-response';
import { Prisma } from '@/external/prisma/generated/client';

const SCH_HOST = process.env.SCH_HOST ?? '';
const SCH_API_KEY = process.env.SCH_API_KEY ?? '';

export const autoCreateRoster = tryCatch(async (request: AutoCreateRosterRequest): Promise<ServiceResponse<RosterDto>> => {
  const parsedRequest = autoCreateRosterRequestSchema.parse(request)

  const canCreate = await checkCanCreate(parsedRequest.teamId)
  if (!canCreate) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const response = await sendArrangeRosterRequest(parsedRequest)
  if (!response) return {
    isSuccess: false,
    message: Message.SYSTEM_ERROR,
  }

  const roster = await convertToRoster(response, parsedRequest.teamId)

  return {
    isSuccess: true,
    data: roster,
  }
})

const checkCanCreate = async (teamId: number): Promise<boolean> => {
  const session = await getSession()

  if (!session) return false
  if (session.roleId === Role.SYSTEM_ADMIN) return true

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
      ownerId: session.userId,
    },
  })

  return team !== null;
}

const sendArrangeRosterRequest = async (request: AutoCreateRosterRequest): Promise<SchArrangeRosterResponse | undefined> => {
  try {
    const response = await fetch(`${SCH_HOST}/roster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SCH_API_KEY,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error('SCH response error', response.status, await response.text());
      return;
    }

    const responseBody = await response.json()
    return schArrangeRosterResponseSchema.parse(responseBody)
  } catch (e) {
    console.error('Fail to send SCH arrange roster request');
    console.error(e);
    return;
  }
}

const convertToRoster = async (response: SchArrangeRosterResponse, teamId: number): Promise<RosterDto> => {
  const [posts, workers] = await fetchRosterData(teamId);
  const workerMap = new Map(workers.map(worker => [worker.id, worker]));
  const postAssignmentMap = buildPostAssignmentMap(response);

  return posts.map(post => ({
    post,
    assignments: convertPostAssignments(post.id, postAssignmentMap, workerMap),
  }));
}

const fetchRosterData = async (teamId: number) => {
  return Promise.all([
    prisma.post.findMany({
      where: { teamId },
      select: { id: true, name: true },
      orderBy: { displayOrder: Prisma.SortOrder.asc },
    }),
    prisma.worker.findMany({
      where: { teamId },
      select: { id: true, name: true }
    }),
  ]);
}

const buildPostAssignmentMap = (response: SchArrangeRosterResponse): Map<number, { timeslot: string; workerId?: number }[]> => {
  const map = new Map<number, { timeslot: string; workerId?: number }[]>();

  for (const rosterTimeslot of response) {
    for (const assignment of rosterTimeslot.assignments) {
      const assignments = map.get(assignment.postId) ?? [];
      assignments.push({
        timeslot: rosterTimeslot.timeslot,
        workerId: assignment.workerId ?? undefined,
      });
      map.set(assignment.postId, assignments);
    }
  }

  return map;
}

const convertPostAssignments = (
  postId: number,
  postAssignmentMap: Map<number, { timeslot: string; workerId?: number }[]>,
  workerMap: Map<number, { id: number; name: string }>
): RosterPostAssignment[] => {
  const assignments = postAssignmentMap.get(postId) ?? [];

  return assignments.map(assignment => {
    if (!assignment.workerId) return {
      timeslot: assignment.timeslot,
    };

    const worker = workerMap.get(assignment.workerId);
    return {
      timeslot: assignment.timeslot,
      worker,
    }
  });
}