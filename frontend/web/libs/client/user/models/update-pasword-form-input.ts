import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";
import { z } from "zod";
import { newPasswordInputSchema } from "./new-password";

export const updatePasswordFormInputSchema = z.object({
  password: newPasswordInputSchema,
  confirmPassword: z.string().min(1, UiMessageContent.REQUIRED),
}).refine(value => value.password === value.confirmPassword, {
  message: UiMessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: ["confirmPassword"],
})

export type UpdatePasswordFormInput = z.infer<typeof updatePasswordFormInputSchema>