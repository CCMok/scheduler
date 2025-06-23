import { ServerResponse } from "@/libs/share/_general/model/server-response";
import { GetMaxHistoryCountRequest } from "../models/get-max-history-count-request";
import { GetMaxHistoryCountResponse } from "../models/get-max-history-count-response";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";

export const getMaxHistoryCount = async (request: GetMaxHistoryCountRequest): Promise<ServerResponse<GetMaxHistoryCountResponse>> => {
  // TODO
  return {
    status: ServerResponseStatus.OK,
    data: {
      maxHistoryCount: 5,
    },
  }
}