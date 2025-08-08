'use server';

import { UpdatePostNameRequest } from "../models/update-post-name-request";
import { updatePostNameService } from "../services/update-post-name-service";

export const updatePostNameAction = async (request: UpdatePostNameRequest) =>
  await updatePostNameService(request)