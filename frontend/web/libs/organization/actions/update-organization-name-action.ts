'use server'

import { UpdateOrganizationNameRequest } from "../models/update-organization-name-request"
import { updateOrganizationNameService } from "../services/update-organization-name-service"

export const updateOrganizationNameAction = async (request: UpdateOrganizationNameRequest) => 
  await updateOrganizationNameService(request)