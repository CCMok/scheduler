'use server'

import { CreateWorkerAffinityRequest } from './create-worker-affinity-request'
import { createWorkerAffinity } from './create-worker-affinity-service'

export const createWorkerAffinityAction = async (request: CreateWorkerAffinityRequest) =>
  await createWorkerAffinity(request)
