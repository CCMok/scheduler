import 'server-only'
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { GetMaxHistoryCountRequest, getMaxHistoryCountRequestSchema } from "../models/get-max-history-count-request";
import { GetMaxHistoryCountResponse } from "../models/get-max-history-count-response";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { findMaxHistoryCount } from '../repositories/organization-repository';

export const getMaxHistoryCount = async (request: GetMaxHistoryCountRequest): Promise<ServerResponse<GetMaxHistoryCountResponse>> => {
  const parsedRequest = getMaxHistoryCountRequestSchema.parse(request);

  const maxHistoryCount = await findMaxHistoryCount(parsedRequest.departmentId)

  return {
    status: ServerResponseStatus.OK,
    data: {
      maxHistoryCount,
    },
  }
}