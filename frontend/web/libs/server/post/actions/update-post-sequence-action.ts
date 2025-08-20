'use server';

import { UpdatePostSequenceRequest } from "../models/update-post-sequence-request";
import { updatePostSequenceService } from "../services/update-post-sequence-service";

export const updatePostSequenceAction = async (request: UpdatePostSequenceRequest) =>
  await updatePostSequenceService(request)