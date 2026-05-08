'use server'

import { deleteWorker } from "./delete-worker-service"

export const deleteWorkerAction = async (id: number) =>
  await deleteWorker(id)