import { z } from "zod";
import { MessageContent } from "@/libs/_general/enums/message";
import { newPasswordFormInputSchema } from "@/libs/user/models/new-password-form-input";

export const updatePasswordFormInputSchema = z.object({
  password: newPasswordFormInputSchema,
  confirmPassword: z.string().min(1, MessageContent.REQUIRED),
}).refine(value => value.password === value.confirmPassword, {
  message: MessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: ["confirmPassword"],
})

export type UpdatePasswordFormInput = z.infer<typeof updatePasswordFormInputSchema>