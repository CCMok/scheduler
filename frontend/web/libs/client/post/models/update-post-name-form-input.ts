import { z } from "zod";
import { MessageContent } from "@/libs/server/_general/enums/message";

export const updatePostNameFormInputSchema = z.object({
  name: z.string().min(1, MessageContent.REQUIRED),
})

export type UpdatePostNameFormInput = z.infer<typeof updatePostNameFormInputSchema>