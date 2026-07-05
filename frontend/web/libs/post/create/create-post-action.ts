'use server'

import { CreatePostRequest } from "./create-post-request";
import { createPost } from "./create-post-service";

export const createPostAction = async (request: CreatePostRequest) =>
  await createPost(request)