'use server'

import { UpdateRosterHistoryRequest } from "../models/update-roster-history-request"
import { updateRosterHistoryService } from "../services/update-roster-history-service"

export const updateRosterHistoryAction = async (request: UpdateRosterHistoryRequest) => 
  await updateRosterHistoryService(request)