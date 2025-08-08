import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const createPostWorkerFormInputSchema = z.object({
  workerId: z.string().min(1, UiMessageContent.REQUIRED),
})

export type CreatePostWorkerFormInput = z.infer<typeof createPostWorkerFormInputSchema>