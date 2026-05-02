'use server'

import { UpdateWorkerNameRequest } from "./update-worker-name-request";
import { updateWorkerName } from "./update-worker-name-service";

export const updateWorkerNameAction = async (request: UpdateWorkerNameRequest) =>
  await updateWorkerName(request)