import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { Message } from '@/libs/_general/service/message';
import { AutoCreateRosterRequest, autoCreateRosterRequestSchema } from './auto-create-roster-request';
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from './sch-arrange-roster-response';
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils';
import { RosterItem, Timeslot } from '../../roster';
import { isNil } from 'lodash';
import { SchArrangeRosterRequest } from './sch-arrange-roster-reqeust';

const SCH_HOST = process.env.SCH_HOST ?? '';
const SCH_API_KEY = process.env.SCH_API_KEY ?? '';

export const autoCreateRoster = tryCatch(async (request: AutoCreateRosterRequest): Promise<ServiceResponse<RosterItem[]>> => {
  const parsedRequest = autoCreateRosterRequestSchema.parse(request)

  const canAccess = await checkCanAccessTeam(parsedRequest.teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const arrangeReqeust = convertToArrangeRosterRequest(parsedRequest)

  const arrangeResponse = await sendArrangeRosterRequest(arrangeReqeust)
  if (!arrangeResponse) return {
    isSuccess: false,
    message: Message.SYSTEM_ERROR,
  }

  const serviceResponse = await convertToServiceResponse(arrangeResponse, parsedRequest.timeslots)

  return {
    isSuccess: true,
    data: serviceResponse,
  }
})

const sendArrangeRosterRequest = async (request: SchArrangeRosterRequest): Promise<SchArrangeRosterResponse | undefined> => {
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

const convertToArrangeRosterRequest = (request: AutoCreateRosterRequest): SchArrangeRosterRequest => {
  // id -> name
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

export const convertToServiceResponse = async (response: SchArrangeRosterResponse, timeslots: Timeslot[]): Promise<RosterItem[]> => {
  // name -> id
  const timeslotMap = new Map(timeslots.map(t => [t.name, t.id]))

  let assignmentCounter = 0;
  return response.map(r => ({
    postId: r.postId,
    assignments: r.timeslots.map(t => {
      const timeslotId = timeslotMap.get(t.timeslot)
      if (isNil(timeslotId)) {
        console.error('Timeslot not found', t.timeslot);
      }
      return {
        id: ++assignmentCounter,
        timeslotId: timeslotId ?? 0,
        workerId: isNil(t.workerId) ? undefined : t.workerId,
      }
    }),
  }))
}