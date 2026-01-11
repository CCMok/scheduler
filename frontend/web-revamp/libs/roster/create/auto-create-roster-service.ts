import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { Roster } from "../roster";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { getSession } from '@/libs/_general/session/session-manager';
import { Message } from '@/libs/_general/service/message';
import { Role } from '@/libs/auth/role/role';
import prisma from '@/libs/_general/database/database-manager';
import { AutoCreateRosterRequest, autoCreateRosterRequestSchema } from './auto-create-roster-request';
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from './sch-arrange-roster-response';

const SCH_HOST = process.env.SCH_HOST ?? '';
const SCH_API_KEY = process.env.SCH_API_KEY ?? '';

export const autoCreateRoster = tryCatch(async (request: AutoCreateRosterRequest): Promise<ServiceResponse<Roster>> => {
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

  const roster = convertToRoster(response)

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

const convertToRoster = (response: SchArrangeRosterResponse): Roster => {
  const postMap = new Map<number, { timeslot: string; workerId?: number }[]>();

  for (const slot of response) {
    for (const arrangement of slot.arrangements) {
      if (!postMap.has(arrangement.postId)) {
        postMap.set(arrangement.postId, [])
      }
      postMap.get(arrangement.postId)!.push({
        timeslot: slot.timeslot,
        workerId: arrangement.workerId ?? undefined,
      })
    }
  }

  return {
    posts: [...postMap].map(([postId, assignments]) => ({
      postId,
      assignments,
    })),
  }
}