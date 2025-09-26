'use server';

import { DeleteWorkerConstraintRequest } from "../models/delete-worker-constraint-request";
import { deleteWorkerConstraintService } from "../services/delete-worker-constraint-service";

export const deleteWorkerConstraintAction = async (request: DeleteWorkerConstraintRequest) =>
  await deleteWorkerConstraintService(request)