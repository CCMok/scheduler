'use server';

import { deleteOrganizationService } from "../services/delete-organization-service";

export const deleteOrganizationAction = async (id: number) =>
  await deleteOrganizationService(id)