'use server'

import { actionWrapper } from "../../_general/actions/general-action"
import { UpdateOrganizationNameRequest } from "../models/update-organization-name-request"
import { updateOrganizationName } from "../services/update-organization-name-service"

export const updateOrganizationNameAction = async (request: UpdateOrganizationNameRequest) => 
  await actionWrapper(async () => await updateOrganizationName(request))