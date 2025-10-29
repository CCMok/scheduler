'use server';

import { GetDepartmentsRequest } from "../models/get-departments-request";
import { getDepartmentsService } from "../services/get-departments-service";

export const getDepartmentsAction = async (request: GetDepartmentsRequest) =>
  await getDepartmentsService(request)