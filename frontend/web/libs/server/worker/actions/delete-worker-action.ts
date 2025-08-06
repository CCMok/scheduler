'use server';

import { DeleteWorkerRequest } from "../models/delete-worker-request";
import { deleteWorkerService } from "../services/delete-worker-service";

export const deleteWorkerAction = async (request: DeleteWorkerRequest) =>
  await deleteWorkerService(request)