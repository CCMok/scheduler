'use server';

import { CreatePostWorkerRequest } from "../models/create-post-worker-request";
import { createPostWorkerService } from "../services/create-post-worker-service";

export const createPostWorkerAction = async (request: CreatePostWorkerRequest) =>
  await createPostWorkerService(request)