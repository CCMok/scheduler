import { z } from "zod";
import { MessageContent } from "@/libs/_general/enums/message";

export const createWorkerPostFormInputSchema = z.object({
  postId: z.number({ required_error: MessageContent.REQUIRED }),
})

export type CreateWorkerPostFormInput = z.infer<typeof createWorkerPostFormInputSchema>