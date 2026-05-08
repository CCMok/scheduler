'use server'

import { CreateWorkerRequest } from "./create-worker-request";
import { createWorker } from "./create-worker-service";

export const createWorkerAction = async (request: CreateWorkerRequest) =>
  await createWorker(request)