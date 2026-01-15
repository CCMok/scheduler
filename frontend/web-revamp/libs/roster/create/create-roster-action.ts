'use server'

import { CreateRosterRequest } from "./create-roster-request";
import { createRoster } from "./create-roster-service";

export const createRosterAction = async (request: CreateRosterRequest) =>
  await createRoster(request)