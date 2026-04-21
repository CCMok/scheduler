'use server'

import { UpdateTeamNameRequest } from "./update-team-name-request";
import { updateTeamName } from "./update-team-name-service";

export const updateTeamNameAction = async (request: UpdateTeamNameRequest) =>
  await updateTeamName(request)