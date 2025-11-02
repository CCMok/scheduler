'use server';

import { deletePostService } from "../services/delete-post-service";

export const deletePostAction = async (id: number) =>
  await deletePostService(id)