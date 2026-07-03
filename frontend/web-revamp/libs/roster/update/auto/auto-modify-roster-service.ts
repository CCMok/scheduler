import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { Message } from '@/libs/_general/service/message';
import { checkCanAccessTeam } from '@/libs/auth/general/access-utils';
import { isNil } from 'lodash';
import { RosterItem, RosterJoin } from '../../roster';
import { AutoModifyRosterRequest, autoModifyRosterRequestSchema } from './auto-modify-roster-request';
import { SchModifyRosterRequest } from './sch-modify-roster-request';
import { SchArrangeRosterResponse, schArrangeRosterResponseSchema } from '../../create/auto/sch-arrange-roster-response';
import { convertToServiceResponse } from '../../create/auto/auto-create-roster-service';
import { getRosterById } from '../../read/get-roster-service';

const SCH_HOST = process.env.SCH_HOST ?? '';
const SCH_API_KEY = process.env.SCH_API_KEY ?? '';

export const autoModifyRoster = tryCatch(async (request: AutoModifyRosterRequest): Promise<ServiceResponse<RosterItem[]>> => {
  const parsedRequest = autoModifyRosterRequestSchema.parse(request)

  const roster = await getRosterById(parsedRequest.rosterId)
  if (isNil(roster)) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '值班表'),
  }

  const canAccess = await checkCanAccessTeam(roster.teamId)
  if (!canAccess) return {
    isSuccess: false,
    message: Message.UNAUTHORIZED,
  }

  const modifyRequest = convertToModifyRosterRequest(parsedRequest, roster)

  const modifyResponse = await sendModifyRosterRequest(modifyRequest)
  if (!modifyResponse) return {
    isSuccess: false,
    message: Message.SYSTEM_ERROR,
  }

  const serviceResponse = await convertToServiceResponse(modifyResponse, roster.timeslots)

  return {
    isSuccess: true,
    data: serviceResponse,
  }
})

const sendModifyRosterRequest = async (request: SchModifyRosterRequest): Promise<SchArrangeRosterResponse | undefined> => {
  try {
    const response = await fetch(`${SCH_HOST}/roster/modify`, {
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
    console.error('Fail to send SCH modify roster request');
    console.error(e);
    return;
  }
}

const convertToModifyRosterRequest = (request: AutoModifyRosterRequest, roster: RosterJoin): SchModifyRosterRequest => {
  // id -> name
  const timeslotMap = new Map(roster.timeslots.map(t => [t.id, t.name]))

  // Original roster is built from db data, not user modified data
  const originalRosterMap = new Map<number, SchModifyRosterRequest['originalRoster'][number]>()
  for (const timeslot of roster.timeslots) {
    for (const assignment of timeslot.assignments) {
      if (!originalRosterMap.has(assignment.postId)) {
        originalRosterMap.set(assignment.postId, {
          postId: assignment.postId,
          timeslots: [],
        })
      }

      originalRosterMap.get(assignment.postId)!.timeslots.push({
        timeslot: timeslot.name,
        workerId: assignment.workerId,
      })
    }
  }

  return {
    teamId: roster.teamId,
    timeslots: roster.timeslots.map(t => t.name),
    offs: request.offs.map(off => ({
      workerId: off.workerId,
      timeslots: off.timeslotIds.map(timeslotId => timeslotMap.get(timeslotId) ?? ''),
    })),
    originalRoster: Array.from(originalRosterMap.values()),
  }
}
