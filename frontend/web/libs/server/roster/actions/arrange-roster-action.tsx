'use server'

import { ArrangeRosterRequest } from "../models/arrange/arrange-roster-request"
import { arrangeRoster } from "../services/arrange-roster-service"

export const arrangeRosterAction = async (request: ArrangeRosterRequest) => 
  await arrangeRoster(request)