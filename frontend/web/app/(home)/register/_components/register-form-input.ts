import { z } from "zod";
import { MessageContent } from "@/libs/_general/enums/message";
import { newPasswordFormInputSchema } from "@/libs/user/models/new-password-form-input";

export const registerFormInputSchema = z.object({
  email: z.string().min(1, MessageContent.REQUIRED).email(
    MessageContent.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: newPasswordFormInputSchema,
  confirmPassword: z.string().min(1, MessageContent.REQUIRED),
  name: z.string().min(0, MessageContent.REQUIRED),
}).refine(value => value.password === value.confirmPassword, {
  message: MessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: ["confirmPassword"],
})

export type RegisterFormInput = z.infer<typeof registerFormInputSchema>