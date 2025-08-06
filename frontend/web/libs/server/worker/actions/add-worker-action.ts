'use server';

import { AddWorkerRequest } from "../models/add-worker-request";
import { addWorker } from "../services/add-worker-service";

export const addWorkerAction = async (request: AddWorkerRequest) =>
  await addWorker(request)