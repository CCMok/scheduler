'use server'

import { UpdateWorkerPostsRequest } from "./update-worker-posts-request";
import { updateWorkerPosts } from "./update-worker-posts-service";

export const updateWorkerPostsAction = async (request: UpdateWorkerPostsRequest) =>
  await updateWorkerPosts(request)