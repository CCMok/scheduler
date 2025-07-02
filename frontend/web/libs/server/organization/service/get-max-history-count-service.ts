import 'server-only'
import { ServerResponse } from "@/libs/share/_general/model/server-response";
import { GetMaxHistoryCountRequest, getMaxHistoryCountRequestSchema } from "../models/get-max-history-count-request";
import { GetMaxHistoryCountResponse } from "../models/get-max-history-count-response";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { schemaCheck } from "../../_general/utils/schema-check-utils";
import { findMaxHistoryCount } from '../repositories/organization-repository';

export const getMaxHistoryCount = async (request: GetMaxHistoryCountRequest): Promise<ServerResponse<GetMaxHistoryCountResponse>> => {
  console.log('called')
  const isSchemaCheckSuccess = schemaCheck(getMaxHistoryCountRequestSchema, request);
  if (!isSchemaCheckSuccess) return {
    status: ServerResponseStatus.BAD_REQUEST,
  }

  const maxHistoryCount = await findMaxHistoryCount(request.departmentId)

  return {
    status: ServerResponseStatus.OK,
    data: {
      maxHistoryCount,
    },
  }
}