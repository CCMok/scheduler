import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";
import { ServiceMessage } from "@/libs/share/_general/enums/service-message";

export const postFormInputSchema = z.object({
  tempId: z.string(),
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type PostFormInput = z.infer<typeof postFormInputSchema>

export const workerFormInputSchema = z.object({
  tempId: z.string(),
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type WorkerFormInput = z.infer<typeof workerFormInputSchema>

export const postWorkerFormInputSchema = z.object({
  postTempId: z.string(),
  postName: z.string().min(1, UiMessageContent.REQUIRED),
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
      message: ServiceMessage.FOUND.replaceAll('{0}', '職位名稱'),
    },
  ),
  workers: z.array(workerFormInputSchema).refine(
    workers => {
      const names = workers.map(worker => worker.name);
      const uniqueNames = new Set(names);
      return names.length === uniqueNames.size;
    },
    {
      message: ServiceMessage.FOUND.replaceAll('{0}', '員工名稱'),
    },
  ),
  postWorkers: z.array(postWorkerFormInputSchema),
})

export type RelatedFormInput = z.infer<typeof relatedFormInputSchema>

export const createDepartmentFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
}).merge(relatedFormInputSchema)

export type CreateDepartmentFormInput = z.infer<typeof createDepartmentFormInputSchema>