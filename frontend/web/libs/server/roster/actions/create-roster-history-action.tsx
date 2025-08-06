'use server'

import { CreateRosterHistoryRequest } from "../models/create-roster-request"
import { createRosterHistoryService } from "../services/create-roster-history-service"

export const createRosterHistoryAction = async (request: CreateRosterHistoryRequest) => 
  await createRosterHistoryService(request)