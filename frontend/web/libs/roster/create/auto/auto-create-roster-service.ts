import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { Message } from '@/libs/_general/service/message';
import { AutoCreateRosterRequest, autoCreateRosterRequestSchema } from './auto-create-roster-request';
import { interpretSchArrangeResponse } from './sch-arrange-roster-response';
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils';
import { SchArrangeRosterRequest } from './sch-arrange-roster-reqeust';
import { mapSchPostsToRosterItems } from './map-sch-posts-to-roster-items';
import { AutoArrangeResult } from './auto-arrange-result';

const SCH_HOST = process.env.SCH_HOST ?? '';
const SCH_API_KEY = process.env.SCH_API_KEY ?? '';

export const autoCreateRoster = tryCatch(async (request: AutoCreateRosterRequest): Promise<ServiceResponse<AutoArrangeResult>> => {
  const parsedRequest = autoCreateRosterRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const arrangeRequest = convertToArrangeRosterRequest(parsedRequest)

  const arrangeResponse = await sendArrangeRosterRequest(arrangeRequest)
  if (!arrangeResponse) return {
    isSuccess: false,
    message: Message.SYSTEM_ERROR,
  }

  if (arrangeResponse.kind === 'failure') {
    return {
      isSuccess: false,
      message: arrangeResponse.status === 'INFEASIBLE'
        ? Message.ROSTER_INFEASIBLE
        : Message.ROSTER_SOLVER_ERROR,
    }
  }

  return {
    isSuccess: true,
    data: {
      status: arrangeResponse.status,
      items: mapSchPostsToRosterItems(arrangeResponse.posts, parsedRequest.timeslots),
    },
  }
})

const sendArrangeRosterRequest = async (request: SchArrangeRosterRequest) => {
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
    return interpretSchArrangeResponse(responseBody)
  } catch (e) {
    console.error('Fail to send SCH arrange roster request');
    console.error(e);
    return;
  }
}

const convertToArrangeRosterRequest = (request: AutoCreateRosterRequest): SchArrangeRosterRequest => {
  const timeslotMap = new Map(request.timeslots.map(t => [t.id, t.name]))

  return {
    teamId: request.teamId,
    timeslots: request.timeslots.map(t => t.name),
    offs: request.offs.map(off => ({
      workerId: off.workerId,
      timeslots: off.timeslotIds.map(timeslotId => timeslotMap.get(timeslotId) ?? ''),
    })),
  }
}
