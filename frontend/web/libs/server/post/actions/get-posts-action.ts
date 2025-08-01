'use server';

import { GetPostsRequest } from "../models/get-posts-request";
import { getPosts } from "../services/get-posts-service";

export const getPostsAction = async (request: GetPostsRequest) =>
  await getPosts(request)