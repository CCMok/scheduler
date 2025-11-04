'use server';

import { getWorkersService } from "../services/get-workers-service";

export const getWorkersAction = async (...args: Parameters<typeof getWorkersService>) =>
  await getWorkersService(...args)