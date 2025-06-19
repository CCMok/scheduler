'use server'

import { actionWrapper } from "../../_general/actions/general_action"
import { SaveRosterRequest } from "../model/save-roster-request"
import { saveRoster } from "../service/save-roster-service"

export const saveRosterAction = async (request: SaveRosterRequest) => 
  await actionWrapper(async () => await saveRoster(request))