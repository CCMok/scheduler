'use server'

import { UpdateWorkerStatusRequest } from "./update-worker-status-request";
import { updateWorkerStatus } from "./update-worker-status-service";

export const updateWorkerStatusAction = async (request: UpdateWorkerStatusRequest) =>
  await updateWorkerStatus(request)