'use server';

import { getPostsService } from "../services/get-posts-service";

export const getPostsAction = async (...args: Parameters<typeof getPostsService>) =>
  await getPostsService(...args)