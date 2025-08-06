import 'server-only'
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { GetMaxHistoryCountRequest, getMaxHistoryCountRequestSchema } from "../models/get-max-history-count-request";
import { GetMaxHistoryCountResponse } from "../models/get-max-history-count-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { getMaxHistoryCount } from '../repositories/organization-repository';
import { serviceWrapper } from '../../_general/services/general-service';

export const getMaxHistoryCountService = async (request: GetMaxHistoryCountRequest): Promise<ServiceResponse<GetMaxHistoryCountResponse>> =>
  await serviceWrapper<GetMaxHistoryCountResponse>(async () => {
    const parsedRequest = getMaxHistoryCountRequestSchema.parse(request);

    const maxHistoryCount = await getMaxHistoryCount(parsedRequest.departmentId)

    return {
      status: ServiceResponseStatus.OK,
      data: {
        maxHistoryCount,
      },
    }
  })