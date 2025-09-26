'use server';

import { UpdatePostConstraintRequest } from "../models/update-post-constraint-request";
import { updatePostConstraintService } from "../services/update-post-constraint-service";

export const updatePostConstraintAction = async (request: UpdatePostConstraintRequest) =>
  await updatePostConstraintService(request)