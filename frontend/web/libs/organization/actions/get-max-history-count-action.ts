'use server'

import { getMaxHistoryCountService } from "../services/get-max-history-count-service"

export const getMaxHistoryCountAction = async (departmentId: number) => 
  await getMaxHistoryCountService(departmentId)