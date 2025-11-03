import { z } from "zod";
import { MessageContent } from "@/libs/server/_general/enums/message";

export const updateWorkerNameFormInputSchema = z.object({
  name: z.string().min(1, MessageContent.REQUIRED),
})

export type UpdateWorkerNameFormInput = z.infer<typeof updateWorkerNameFormInputSchema>