import { z } from "zod";
import { MessageContent } from "@/libs/server/_general/enums/message";

export const postFormInputSchema = z.object({
  tempId: z.string(),
  name: z.string().min(1, MessageContent.REQUIRED),
})

export type PostFormInput = z.infer<typeof postFormInputSchema>

export const workerFormInputSchema = z.object({
  tempId: z.string(),
  name: z.string().min(1, MessageContent.REQUIRED),
})

export type WorkerFormInput = z.infer<typeof workerFormInputSchema>

export const postWorkerFormInputSchema = z.object({
  postTempId: z.string(),
  postName: z.string().min(1, MessageContent.REQUIRED),
  workerTempIds: z.array(z.string()),
})

export type PostWorkerFormInput = z.infer<typeof postWorkerFormInputSchema>

export const relatedFormInputSchema = z.object({
  posts: z.array(postFormInputSchema).refine(
    posts => {
      const names = posts.map(post => post.name);
      const uniqueNames = new Set(names);
      return names.length === uniqueNames.size;
    },
    {
      message: MessageContent.FOUND.replaceAll('{0}', '職位名稱'),
    },
  ),
  workers: z.array(workerFormInputSchema).refine(
    workers => {
      const names = workers.map(worker => worker.name);
      const uniqueNames = new Set(names);
      return names.length === uniqueNames.size;
    },
    {
      message: MessageContent.FOUND.replaceAll('{0}', '員工名稱'),
    },
  ),
  postWorkers: z.array(postWorkerFormInputSchema),
})

export type RelatedFormInput = z.infer<typeof relatedFormInputSchema>

export const createDepartmentFormInputSchema = z.object({
  name: z.string().min(1, MessageContent.REQUIRED),
}).merge(relatedFormInputSchema)

export type CreateDepartmentFormInput = z.infer<typeof createDepartmentFormInputSchema>