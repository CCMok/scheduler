import { ServerResponse } from "@/libs/share/_general/model/server-response";
import { ArrangeRosterRequest, arrangeRosterRequestSchema } from "../model/arrange-roster-request";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";

export const arrangeRoster = async (request: ArrangeRosterRequest): Promise<ServerResponse> => {
  const isRequestValid = checkRequest(request);
  if (!isRequestValid) {
    return {
      status: ServerResponseStatus.BAD_REQUEST,
    }
  }

  const fetchResponse = await sendArrangeRosterRequest(request);

  console.log('fetchResponse', fetchResponse)

  return {
    status: ServerResponseStatus.INTERNAL_ERROR,
  };
};

const checkRequest = (request: ArrangeRosterRequest): boolean => {
  const result = arrangeRosterRequestSchema.safeParse(request)
  if (!result.success) {
    console.warn('Invalid request', result.error.format())
  }

  return result.success;
}

const sendArrangeRosterRequest = async (request: ArrangeRosterRequest) => {
  try {
    const response = await fetch(`${process.env.SCH_HOST}/roster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      console.error('Fail to request SCH arrange roster', response.status, await response.text());
      return;
    }

    const responseJson = await response.json()

    // TODO zod validate

    return responseJson;
  } catch (error) {
    console.error('Send Arrange Roster Request Error', error);
    return;
  }
}