'use server';

import { CreateWorkerConstraintRequest } from "../models/create-worker-constraint-request";
import { createWorkerConstraintService } from "../services/create-worker-constraint-service";

export const createWorkerConstraintAction = async (request: CreateWorkerConstraintRequest) =>
  await createWorkerConstraintService(request)