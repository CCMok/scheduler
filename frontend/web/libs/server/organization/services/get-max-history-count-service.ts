import 'server-only'
import { ServiceResponse as OldServiceResponse } from "@/libs/share/_general/models/service-response";
import { GetMaxHistoryCountRequest, getMaxHistoryCountRequestSchema } from "../models/get-max-history-count-request";
import { GetMaxHistoryCountResponse } from "../models/get-max-history-count-response";
import { ServiceResponseStatus as OldServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { getMaxHistoryCount } from '../utils/organization-utils';
import { serviceWrapper } from '../../_general/services/general-service';
import { cache } from 'react';

export const oldgetMaxHistoryCountService = cache(async (request: GetMaxHistoryCountRequest): Promise<OldServiceResponse<GetMaxHistoryCountResponse>> =>
  await serviceWrapper<GetMaxHistoryCountResponse>(async () => {
    const parsedRequest = getMaxHistoryCountRequestSchema.parse(request);

    const maxHistoryCount = await getMaxHistoryCount(parsedRequest.departmentId)

    return {
      status: OldServiceResponseStatus.OK,
      data: maxHistoryCount,
    }
  }))