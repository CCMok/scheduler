import { z } from "zod";
import { MessageContent } from "@/libs/_general/enums/message";

export const createWorkerFormInputSchema = z.object({
  name: z.string().min(1, MessageContent.REQUIRED),
})

export type CreateWorkerFormInput = z.infer<typeof createWorkerFormInputSchema>