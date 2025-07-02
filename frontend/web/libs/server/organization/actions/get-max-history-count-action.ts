'use server'

import { actionWrapper } from "../../_general/actions/general-action"
import { GetMaxHistoryCountRequest } from "../models/get-max-history-count-request"
import { getMaxHistoryCount } from "../service/get-max-history-count-service"

export const getMaxHistoryCountAction = async (request: GetMaxHistoryCountRequest) => 
  await actionWrapper(async () => await getMaxHistoryCount(request))