'use server'

import { GetMaxHistoryCountRequest } from "../models/get-max-history-count-request"
import { getMaxHistoryCount } from "../services/get-max-history-count-service"

export const getMaxHistoryCountAction = async (request: GetMaxHistoryCountRequest) => 
  await getMaxHistoryCount(request)