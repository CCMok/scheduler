'use server'

import { AutoCreateRosterRequest } from "./auto-create-roster-request"
import { autoCreateRoster } from "./auto-create-roster-service"

export const autoCreateRosterAction = async (request: AutoCreateRosterRequest) =>
  await autoCreateRoster(request)