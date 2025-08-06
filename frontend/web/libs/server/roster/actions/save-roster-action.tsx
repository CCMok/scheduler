'use server'

import { SaveRosterRequest } from "../models/save-roster-request"
import { saveRosterService } from "../services/save-roster-service"

export const saveRosterAction = async (request: SaveRosterRequest) => 
  await saveRosterService(request)