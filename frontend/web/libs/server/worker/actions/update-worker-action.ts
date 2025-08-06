'use server';

import { UpdateWorkerRequest } from "../models/update-worker-request";
import { updateWorker } from "../services/update-worker-service";

export const updateWorkerAction = async (request: UpdateWorkerRequest) =>
  await updateWorker(request)