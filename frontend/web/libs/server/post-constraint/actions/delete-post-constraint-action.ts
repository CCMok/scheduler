'use server';

import { deletePostConstraintService } from "../services/delete-post-constraint-service";

export const deletePostConstraintAction = async (id: number) =>
  await deletePostConstraintService(id)