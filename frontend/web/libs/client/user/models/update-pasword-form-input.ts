import { z } from "zod";
import { newPasswordInputSchema } from "./new-password";
import { MessageContent } from "@/libs/server/_general/enums/message";

export const updatePasswordFormInputSchema = z.object({
  password: newPasswordInputSchema,
  confirmPassword: z.string().min(1, MessageContent.REQUIRED),
}).refine(value => value.password === value.confirmPassword, {
  message: MessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: ["confirmPassword"],
})

export type UpdatePasswordFormInput = z.infer<typeof updatePasswordFormInputSchema>