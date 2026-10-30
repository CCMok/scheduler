'use server'

import { UpdatePostAffinityRequest } from './update-post-affinity-request'
import { updatePostAffinity } from './update-post-affinity-service'

export const updatePostAffinityAction = async (request: UpdatePostAffinityRequest) =>
  await updatePostAffinity(request)
