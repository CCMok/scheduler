import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { RosterDto } from "../../roster";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { Message } from '@/libs/_general/service/message';
import { AutoCreateRosterRequest, autoCreateRosterRequestSchema } from './auto-create-roster-request';
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from './sch-arrange-roster-response';
import { checkCanAccessTeam } from '@/libs/auth/authorization/access-utils';

const SCH_HOST = process.env.SCH_HOST ?? '';
const SCH_API_KEY = process.env.SCH_API_KEY ?? '';

export const autoCreateRoster = tryCatch(async (request: AutoCreateRosterRequest): Promise<ServiceResponse<RosterDto>> => {
  const parsedRequest = autoCreateRosterRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.teamId)
  if (!canAccess) return {
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
  return response.map(r => ({
    timeslot: r.timeslot,
    assignments: r.assignments.map(a => ({
      postId: a.postId,
      workerId: a.workerId ?? undefined,
    })),
  }))
}