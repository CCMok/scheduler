import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";
import { z } from "zod";

export const updateUserNameFormInputSchema = z.object({
  name: z.string().min(0, UiMessageContent.REQUIRED),
})

export type UpdateUserNameFormInput = z.infer<typeof updateUserNameFormInputSchema>