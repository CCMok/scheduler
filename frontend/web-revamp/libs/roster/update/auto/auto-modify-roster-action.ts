'use server'

import { AutoModifyRosterRequest } from "./auto-modify-roster-request"
import { autoModifyRoster } from "./auto-modify-roster-service"

export const autoModifyRosterAction = async (request: AutoModifyRosterRequest) =>
  await autoModifyRoster(request)
