'use server';

import { CreateWorkerRequest } from "../models/create-worker-request";
import { createWorkerService } from "../services/create-worker-service";

export const createWorkerAction = async (request: CreateWorkerRequest) =>
  await createWorkerService(request)