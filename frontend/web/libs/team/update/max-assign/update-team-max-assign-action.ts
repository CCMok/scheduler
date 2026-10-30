'use server'

import { UpdateTeamMaxAssignRequest } from './update-team-max-assign-request'
import { updateTeamMaxAssign } from './update-team-max-assign-service'

export const updateTeamMaxAssignAction = async (request: UpdateTeamMaxAssignRequest) =>
  await updateTeamMaxAssign(request)
