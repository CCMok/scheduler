'use server';

import { deleteWorkerConstraintService } from "../services/delete-worker-constraint-service";

export const deleteWorkerConstraintAction = async (id: number) =>
  await deleteWorkerConstraintService(id)