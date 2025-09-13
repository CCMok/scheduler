'use server';

import { DeleteDepartmentRequest } from "../models/delete-department-request";
import { deleteDepartmentService } from "../services/delete-department-service";

export const deleteDepartmentAction = async (request: DeleteDepartmentRequest) =>
  await deleteDepartmentService(request)