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

  return {
    status: ServerResponseStatus.INTERNAL_ERROR,
  }
}

const checkRequest = (request: ArrangeRosterRequest): boolean => {
  const result = arrangeRosterRequestSchema.safeParse(request)
  if (!result.success) {
    console.warn('Invalid request', result.error.format())
  }

  return result.success;
}