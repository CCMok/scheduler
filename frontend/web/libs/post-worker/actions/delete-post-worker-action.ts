'use server';

import { DeletePostWorkerRequest } from "../models/delete-post-worker-request";
import { deletePostWorkerService } from "../services/delete-post-worker-service";

export const deletePostWorkerAction = async (request: DeletePostWorkerRequest) =>
  await deletePostWorkerService(request)