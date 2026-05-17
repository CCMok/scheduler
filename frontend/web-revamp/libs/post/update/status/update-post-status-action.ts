'use server'

import { UpdatePostStatusRequest } from "./update-post-status-request";
import { updatePostStatus } from "./update-post-status-service";

export const updatePostStatusAction = async (request: UpdatePostStatusRequest) =>
  await updatePostStatus(request)