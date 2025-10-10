import { z } from "zod";

export const postRequestSchema = z.object({
  name: z.string().min(1),
})

export type PostRequest = z.infer<typeof postRequestSchema>

export const workerRequestSchema = z.object({
  name: z.string().min(1),
})

export type WorkerRequest = z.infer<typeof workerRequestSchema>

export const postWorkerRequestSchema = z.object({
  postName: z.string().min(1),
  workerNames: z.array(z.string().min(1)),
})

export type PostWorkerRequest = z.infer<typeof postWorkerRequestSchema>

export const createOrganizationRequestSchema = z.object({
  name: z.string().min(1),
  departmentName: z.string().min(1),
  posts: z.array(postRequestSchema),
  workers: z.array(workerRequestSchema),
  postWorkers: z.array(postWorkerRequestSchema),
})

export type CreateOrganizationRequest = z.infer<typeof createOrganizationRequestSchema>