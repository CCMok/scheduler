'use server';

import { getDepartmentsService } from "../services/get-departments-service";

export const getDepartmentsAction = async (
  ...args: Parameters<typeof getDepartmentsService>
) => await getDepartmentsService(...args)