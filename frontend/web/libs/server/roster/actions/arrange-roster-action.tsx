'use server'

import { actionWrapper } from "../../_general/actions/general-action"
import { ArrangeRosterRequest } from "../models/arrange/arrange-roster-request"
import { arrangeRoster } from "../services/arrange-roster-service"

export const arrangeRosterAction = async (request: ArrangeRosterRequest) => 
  await actionWrapper(async () => await arrangeRoster(request))