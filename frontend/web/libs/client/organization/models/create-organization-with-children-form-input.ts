import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";
import { ServiceMessage } from "@/libs/share/_general/enums/service-message";

export const postFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type PostFormInput = z.infer<typeof postFormInputSchema>

export const workerFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
})

export type WorkerFormInput = z.infer<typeof workerFormInputSchema>

export const createOrganizationWithChildrenFormInputSchema = z.object({
  name: z.string().min(1, UiMessageContent.REQUIRED),
  departmentName: z.string().min(1, UiMessageContent.REQUIRED),
  posts: z.array(postFormInputSchema),
  workers: z.array(workerFormInputSchema),
  postWorkers: z.array(z.object({
    postName: z.string().min(1, UiMessageContent.REQUIRED),
    workerName: z.string().min(1, UiMessageContent.REQUIRED),
  })),
}).refine(
  data => {
    const names = data.posts.map(post => post.name);
    const uniqueNames = new Set(names);
    return names.length === uniqueNames.size;
  },
  {
    message: ServiceMessage.FOUND.replaceAll('{0}', '職位名稱'),
    path: ["posts"],
  }
).refine(
  data => {
    const names = data.workers.map(worker => worker.name);
    const uniqueNames = new Set(names);
    return names.length === uniqueNames.size;
  },
  {
    message: ServiceMessage.FOUND.replaceAll('{0}', '員工名稱'),
    path: ["workers"],
  }
)

export type CreateOrganizationWithChildrenFormInput = z.infer<typeof createOrganizationWithChildrenFormInputSchema>