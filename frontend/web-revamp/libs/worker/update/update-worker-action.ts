'use server'

import { UpdateWorkerRequest } from "./update-worker-request";
import { updateWorker } from "./update-worker-service";

export const updateWorkerAction = async (request: UpdateWorkerRequest) =>
  await updateWorker(request)