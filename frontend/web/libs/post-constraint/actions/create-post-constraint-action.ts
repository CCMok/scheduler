'use server';

import { CreatePostConstraintRequest } from "../models/create-post-constraint-request";
import { createPostConstraintService } from "../services/create-post-constraint-service";

export const createPostConstraintAction = async (request: CreatePostConstraintRequest) =>
  await createPostConstraintService(request)