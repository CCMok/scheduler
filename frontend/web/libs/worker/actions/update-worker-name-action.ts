'use server';

import { UpdateWorkerNameRequest } from "../models/update-worker-name-request";
import { updateWorkerNameService } from "../services/update-worker-name-service";

export const updateWorkerNameAction = async (request: UpdateWorkerNameRequest) =>
  await updateWorkerNameService(request)