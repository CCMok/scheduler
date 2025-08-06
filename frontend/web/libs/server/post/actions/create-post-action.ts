'use server';

import { CreatePostRequest } from "../models/create-post-request";
import { createPostService } from "../services/create-post-service";

export const createPostAction = async (request: CreatePostRequest) =>
  await createPostService(request)