import { z } from "zod";
import { MessageContent } from "@/libs/server/_general/enums/message";

export const updateNameFormInputSchema = z.object({
  name: z.string().min(1, MessageContent.REQUIRED),
})

export type UpdateNameFormInput = z.infer<typeof updateNameFormInputSchema>