'use server'

import { UpdatePostWorkersRequest } from "./update-post-workers-request";
import { updatePostWorkers } from "./update-post-workers-service";

export const updatePostWorkersAction = async (request: UpdatePostWorkersRequest) =>
  await updatePostWorkers(request)