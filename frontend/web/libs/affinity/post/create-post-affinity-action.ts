'use server'

import { CreatePostAffinityRequest } from './create-post-affinity-request'
import { createPostAffinity } from './create-post-affinity-service'

export const createPostAffinityAction = async (request: CreatePostAffinityRequest) =>
  await createPostAffinity(request)
