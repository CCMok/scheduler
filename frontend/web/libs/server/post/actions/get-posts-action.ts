'use server';

import { GetPostsRequest } from "../models/get-posts-request";
import { getPostsService } from "../services/get-posts-service";

export const getPostsAction = async (request: GetPostsRequest) =>
  await getPostsService(request)