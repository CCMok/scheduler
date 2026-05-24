'use server'

import { CreateTeamRequest } from "./create-team-request";
import { createTeam } from "./create-team-service";

export const createTeamAction = async (request: CreateTeamRequest) =>
  await createTeam(request)