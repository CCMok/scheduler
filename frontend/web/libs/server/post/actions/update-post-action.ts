'use server';

import { UpdatePostRequest } from "../models/update-post-request";
import { updatePost } from "../services/update-post-service";

export const updatePostAction = async (request: UpdatePostRequest) =>
  await updatePost(request)