'use server';

import { deleteDepartmentService } from "../services/delete-department-service";

export const deleteDepartmentAction = async (id: number) =>
  await deleteDepartmentService(id)