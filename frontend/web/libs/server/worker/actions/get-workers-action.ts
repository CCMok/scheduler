'use server';

import { GetWorkersRequest } from "../models/get-workers-request";
import { getWorkers } from "../services/get-workers-service";

export const getWorkersAction = async (request: GetWorkersRequest) =>
  await getWorkers(request)