'use server'

import { DeleteWorkerAffinityRequest } from './delete-worker-affinity-request'
import { deleteWorkerAffinity } from './delete-worker-affinity-service'

export const deleteWorkerAffinityAction = async (request: DeleteWorkerAffinityRequest) =>
  await deleteWorkerAffinity(request)
