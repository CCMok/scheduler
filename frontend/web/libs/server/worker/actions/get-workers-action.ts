'use server';

import { GetWorkersRequest } from "../models/get-workers-request";
import { getWorkersService } from "../services/get-workers-service";

export const getWorkersAction = async (request: GetWorkersRequest) =>
  await getWorkersService(request)