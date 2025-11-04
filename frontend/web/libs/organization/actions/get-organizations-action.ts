'use server';

import { getOrganizationsService } from "../services/get-organizations-service";

export const getOrganizationsAction = async (...args: Parameters<typeof getOrganizationsService>) =>
  await getOrganizationsService(...args)