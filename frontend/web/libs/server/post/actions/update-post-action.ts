'use server';

import { UpdatePostRequest } from "../models/update-post-request";
import { updatePostService } from "../services/update-post-service";

export const updatePostAction = async (request: UpdatePostRequest) =>
  await updatePostService(request)