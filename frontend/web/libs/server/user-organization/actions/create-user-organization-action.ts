'use server';

import { CreateUserOrganizationRequest } from "../models/create-user-organization-request";
import { createUserOrganizationService } from "../services/create-user-organization-service";

export const createUserOrganizationAction = async (request: CreateUserOrganizationRequest) =>
  await createUserOrganizationService(request)