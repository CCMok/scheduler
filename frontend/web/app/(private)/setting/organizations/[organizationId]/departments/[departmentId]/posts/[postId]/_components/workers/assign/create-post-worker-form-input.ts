import { z } from "zod";
import { MessageContent } from "@/libs/_general/enums/message";

export const createPostWorkerFormInputSchema = z.object({
  workerId: z.number({ required_error: MessageContent.REQUIRED }),
})

export type CreatePostWorkerFormInput = z.infer<typeof createPostWorkerFormInputSchema>