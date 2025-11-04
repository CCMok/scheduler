import { z } from "zod";
import { idSchema } from "../../_general/models/id";

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

export const relatedRequestSchema = z.object({
  posts: z.array(postRequestSchema),
  workers: z.array(workerRequestSchema),
  postWorkers: z.array(postWorkerRequestSchema),
})

export const createDepartmentRequestSchema = z.object({
  organizationId: idSchema,
  name: z.string().min(1),
}).merge(relatedRequestSchema)

export type CreateDepartmentRequest = z.infer<typeof createDepartmentRequestSchema>