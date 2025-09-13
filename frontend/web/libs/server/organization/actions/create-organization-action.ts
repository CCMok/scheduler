'use server';

import { CreateOrganizationRequest } from "../models/create-organization-request";
import { createOrganizationService } from "../services/create-organization-service";

export const createOrganizationAction = async (request: CreateOrganizationRequest) =>
  await createOrganizationService(request)