'use server';

import { DeleteOrganizationRequest } from "../models/delete-organization-request";
import { deleteOrganizationService } from "../services/delete-organization-service";

export const deleteOrganizationAction = async (request: DeleteOrganizationRequest) =>
  await deleteOrganizationService(request)