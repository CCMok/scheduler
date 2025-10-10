'use server';

import { CreateOrganizationWithChildrenRequest } from "../models/create-organization-with-children-request";
import { createOrganizationWithChildrenService } from "../services/create-organization-with-children-service";

export const createOrganizationWithChildrenAction = async (request: CreateOrganizationWithChildrenRequest) =>
  await createOrganizationWithChildrenService(request)