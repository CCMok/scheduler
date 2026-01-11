'use server'

import { autoCreateRoster } from "./auto-create-roster-service";
import { AutoCreateRosterRequest } from "./auto-create-roster-request";

export const autoCreateRosterAction = async (request: AutoCreateRosterRequest) =>
  await autoCreateRoster(request)