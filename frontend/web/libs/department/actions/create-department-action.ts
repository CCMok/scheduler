'use server';

import { CreateDepartmentRequest } from "../models/create-department-request";
import { createDepartmentService } from "../services/create-department-service";

export const createDepartmentAction = async (request: CreateDepartmentRequest) =>
  await createDepartmentService(request)