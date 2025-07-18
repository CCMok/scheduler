'use server';

import { actionWrapper } from "../../_general/actions/general-action";
import { GetPostsRequest } from "../models/get-posts-request";
import { getPosts } from "../services/get-posts-service";

export const getPostsAction = async (request: GetPostsRequest) =>
  await actionWrapper(async () => await getPosts(request)); 