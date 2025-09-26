'use server';

import { DeletePostConstraintRequest } from "../models/delete-post-constraint-request";
import { deletePostConstraintService } from "../services/delete-post-constraint-service";

export const deletePostConstraintAction = async (request: DeletePostConstraintRequest) =>
  await deletePostConstraintService(request)