'use server'

import { UpdateRosterRequest } from "./update-roster-request";
import { updateRoster } from "./update-roster-service";

export const updateRosterAction = async (request: UpdateRosterRequest) =>
  await updateRoster(request)