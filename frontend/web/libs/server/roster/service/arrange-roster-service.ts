import { ServerResponse } from "@/libs/share/_general/model/server-response";
import { ArrangeRosterRequest, arrangeRosterRequestSchema } from "../model/arrange-roster-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { ArrangeRosterResponse, arrangeRosterResponseSchema } from "../model/arrange-roster-response";

export const arrangeRoster = async (request: ArrangeRosterRequest): Promise<ServerResponse<ArrangeRosterResponse>> => {
  const isRequestValid = checkRequest(request);
  if (!isRequestValid) {
    return {
      status: ServerResponseStatus.BAD_REQUEST,
    }
  }

  const fetchResponse = await sendArrangeRosterRequest(request);

  if (!fetchResponse) return {
    status: ServerResponseStatus.INTERNAL_ERROR
  }

  const parseResult = arrangeRosterResponseSchema.safeParse(fetchResponse)
  if (!parseResult.success) {
    console.error('Invalid response', parseResult.error.format())
    return {
      status: ServerResponseStatus.INTERNAL_ERROR,
    }
  }

  return {
    status: ServerResponseStatus.OK,
    data: parseResult.data,
  }
};

const checkRequest = (request: ArrangeRosterRequest): boolean => {
  const result = arrangeRosterRequestSchema.safeParse(request)
  if (!result.success) {
    console.warn('Invalid request', result.error.format())
  }

  return result.success;
}

const sendArrangeRosterRequest = async (request: ArrangeRosterRequest): Promise<any> => {
  try {
    const response = await fetch(`${process.env.SCH_HOST}/roster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error('SCH response error', response.status, await response.text());
      return;
    }

    return await response.json()
  } catch (error) {
    console.error('Fail to send SCH arrange roster request', error);
    return;
  }
}