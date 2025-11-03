import { MessageContent } from "@/libs/server/_general/enums/message";
import { z } from "zod";

export const updateUserNameFormInputSchema = z.object({
  name: z.string().min(0, MessageContent.REQUIRED),
})

export type UpdateUserNameFormInput = z.infer<typeof updateUserNameFormInputSchema>