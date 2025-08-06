'use server';

import { DeleteWorkerRequest } from "../models/delete-worker-request";
import { deleteWorker } from "../services/delete-worker-service";

export const deleteWorkerAction = async (request: DeleteWorkerRequest) =>
  await deleteWorker(request)