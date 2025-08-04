'use server';

import { DeletePostRequest } from "../models/delete-post-request";
import { deletePost } from "../services/delete-post-service";

export const deletePostAction = async (request: DeletePostRequest) =>
  await deletePost(request)