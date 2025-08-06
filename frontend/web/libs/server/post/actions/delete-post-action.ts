'use server';

import { DeletePostRequest } from "../models/delete-post-request";
import { deletePostService } from "../services/delete-post-service";

export const deletePostAction = async (request: DeletePostRequest) =>
  await deletePostService(request)