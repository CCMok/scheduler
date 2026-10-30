'use server'

import { UpdateWorkerAffinityRequest } from './update-worker-affinity-request'
import { updateWorkerAffinity } from './update-worker-affinity-service'

export const updateWorkerAffinityAction = async (request: UpdateWorkerAffinityRequest) =>
  await updateWorkerAffinity(request)
