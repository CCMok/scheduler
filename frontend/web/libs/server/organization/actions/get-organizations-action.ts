'use server';

import { GetOrganizationsRequest } from "../models/get-organizations-request";
import { getOrganizationsService } from "../services/get-organizations-service";

export const getOrganizationsAction = async (request: GetOrganizationsRequest) =>
  await getOrganizationsService(request)