'use server';

import { deleteWorkerService } from "../services/delete-worker-service";

export const deleteWorkerAction = async (id: number) =>
  await deleteWorkerService(id)