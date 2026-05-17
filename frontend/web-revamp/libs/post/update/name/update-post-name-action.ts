'use server'

import { UpdatePostNameRequest } from "./update-post-name-request";
import { updatePostName } from "./update-post-name-service";

export const updatePostNameAction = async (request: UpdatePostNameRequest) =>
  await updatePostName(request)