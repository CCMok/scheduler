import { z } from "zod";
import { UiMessageContent } from "../../../share/_general/enums/ui-message";

export const createWorkerPostFormInputSchema = z.object({
  postId: z.string().min(1, UiMessageContent.REQUIRED),
})

export type CreateWorkerPostFormInput = z.infer<typeof createWorkerPostFormInputSchema>