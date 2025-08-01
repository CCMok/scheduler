'use server'

import { SaveRosterRequest } from "../models/save-roster-request"
import { saveRoster } from "../services/save-roster-service"

export const saveRosterAction = async (request: SaveRosterRequest) => 
  await saveRoster(request)