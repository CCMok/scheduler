'use server';

import { AddPostRequest } from "../models/add-post-request";
import { addPost } from "../services/add-post-service";

export const addPostAction = async (request: AddPostRequest) =>
  await addPost(request)