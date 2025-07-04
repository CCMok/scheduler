'use server'

import { actionWrapper } from "../../_general/actions/general-action"
import { SaveRosterRequest } from "../models/save-roster-request"
import { saveRoster } from "../services/save-roster-service"

export const saveRosterAction = async (request: SaveRosterRequest) => 
  await actionWrapper(async () => await saveRoster(request))