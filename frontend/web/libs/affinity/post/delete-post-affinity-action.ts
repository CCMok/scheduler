'use server'

import { DeletePostAffinityRequest } from './delete-post-affinity-request'
import { deletePostAffinity } from './delete-post-affinity-service'

export const deletePostAffinityAction = async (request: DeletePostAffinityRequest) =>
  await deletePostAffinity(request)
