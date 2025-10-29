'use server';

import { DeleteUserOrganizationRequest } from "../models/delete-user-organization-request";
import { deleteUserOrganizationService } from "../services/delete-user-organization-service";

export const deleteUserOrganizationAction = async (request: DeleteUserOrganizationRequest) =>
  await deleteUserOrganizationService(request)