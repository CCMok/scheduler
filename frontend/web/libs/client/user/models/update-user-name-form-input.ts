import { ClientMessageContent } from "@/libs/client/_general/enums/client-message-enum";
import { z } from "zod";

export const updateUserNameFormInputSchema = z.object({
  name: z.string().min(0, ClientMessageContent.REQUIRED),
})

export type UpdateUserNameFormInput = z.infer<typeof updateUserNameFormInputSchema>