'use server';

import { UpdateWorkerRequest } from "../models/update-worker-request";
import { updateWorkerService } from "../services/update-worker-service";

export const updateWorkerAction = async (request: UpdateWorkerRequest) =>
  await updateWorkerService(request)