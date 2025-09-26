'use server';

import { UpdateWorkerConstraintRequest } from "../models/update-worker-constraint-request";
import { updateWorkerConstraintService } from "../services/update-worker-constraint-service";

export const updateWorkerConstraintAction = async (request: UpdateWorkerConstraintRequest) =>
  await updateWorkerConstraintService(request)